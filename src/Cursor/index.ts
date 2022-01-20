import { Cursor } from "./Cursor";
import { CursorState, Events } from "../constants";
import { emitter, WindowManager } from "../index";
import { throttle } from "lodash";
import type { CursorMovePayload } from "../index";
import type { PositionType } from "../AttributesDelegate";
import type { Point, RoomMember, View } from "white-web-sdk";
import type { AppManager } from "../AppManager";

export type EventType = {
    type: PositionType;
    id?: string;
};

export type MoveCursorParams = {
    uid: string;
    x: number;
    y: number;
};
export class CursorManager {
    public containerRect?: DOMRect;
    public wrapperRect?: DOMRect;
    public cursorInstances: Map<string, Cursor> = new Map();
    public roomMembers?: readonly RoomMember[];
    private mainViewElement?: HTMLDivElement;
    private store = this.manager.store;

    constructor(private manager: AppManager) {
        this.roomMembers = this.manager.room?.state.roomMembers;
        const wrapper = WindowManager.wrapper;
        if (wrapper) {
            wrapper.addEventListener("pointerenter", this.mouseMoveListener);
            wrapper.addEventListener("pointermove", this.mouseMoveListener);
            wrapper.addEventListener("pointerleave", this.mouseLeaveListener);
            this.wrapperRect = wrapper.getBoundingClientRect();
        }
        emitter.on("cursorMove", payload => {
            let cursorInstance = this.cursorInstances.get(payload.uid);
            if (!cursorInstance) {
                cursorInstance = new Cursor(this.manager, payload.uid, this, wrapper);
                this.cursorInstances.set(payload.uid, cursorInstance);
            }
            if (payload.state === CursorState.Leave) {
                cursorInstance.leave();
            } else {
                cursorInstance.move(payload.position);
            }
        });
    }

    public setMainViewDivElement(div: HTMLDivElement) {
        this.mainViewElement = div;
    }

    public get boxState() {
        return this.store.getBoxState();
    }

    public get focusView() {
        return this.manager.focusApp?.view;
    }

    private mouseMoveListener = throttle((event: MouseEvent) => {
        this.updateCursor(this.getType(event), event.clientX, event.clientY);
    }, 16);

    private updateCursor(event: EventType, clientX: number, clientY: number) {
        if (this.wrapperRect && this.manager.canOperate) {
            const view = event.type === "main" ? this.manager.mainView : this.focusView;
            const point = this.getPoint(view, clientX, clientY);
            if (point) {
                this.manager.dispatchInternalEvent(Events.CursorMove, {
                    uid: this.manager.uid,
                    position: {
                        x: point.x,
                        y: point.y,
                        type: event.type,
                    },
                } as CursorMovePayload);
            }
        }
    }

    private getPoint = (
        view: View | undefined,
        clientX: number,
        clientY: number
    ): Point | undefined => {
        const rect = view?.divElement?.getBoundingClientRect();
        if (rect) {
            const point = view?.convertToPointInWorld({
                x: clientX - rect.x,
                y: clientY - rect.y,
            });
            return point;
        }
    };

    /**
     *  因为窗口内框在不同分辨率下的大小不一样，所以这里通过来鼠标事件的 target 来判断是在主白板还是在 APP 中
     */
    private getType = (event: MouseEvent | Touch): EventType => {
        const target = event.target as HTMLElement;
        const focusApp = this.manager.focusApp;
        switch (target.parentElement) {
            case this.mainViewElement: {
                return { type: "main" };
            }
            case focusApp?.view?.divElement: {
                return { type: "app" };
            }
            default: {
                return { type: "main" };
            }
        }
    };

    private mouseLeaveListener = () => {
        this.hideCursor(this.manager.uid);
        this.manager.dispatchInternalEvent(Events.CursorMove, {
            uid: this.manager.uid,
            state: CursorState.Leave,
        } as CursorMovePayload);
    };

    public updateContainerRect() {
        this.containerRect = WindowManager.container?.getBoundingClientRect();
        this.wrapperRect = WindowManager.wrapper?.getBoundingClientRect();
    }

    public deleteCursor(uid: string) {
        const cursor = this.cursorInstances.get(uid);
        if (cursor) {
            cursor.destroy();
        }
    }

    public hideCursor(uid: string) {
        const cursor = this.cursorInstances.get(uid);
        if (cursor) {
            cursor.hide();
        }
    }

    public destroy() {
        const wrapper = WindowManager.wrapper;
        if (wrapper) {
            wrapper.removeEventListener("pointerenter", this.mouseMoveListener);
            wrapper.removeEventListener("pointermove", this.mouseMoveListener);
            wrapper.removeEventListener("pointerleave", this.mouseLeaveListener);
        }
        if (this.cursorInstances.size) {
            this.cursorInstances.forEach(cursor => cursor.destroy());
            this.cursorInstances.clear();
        }
        this.manager.refresher?.remove("cursors");
    }
}
