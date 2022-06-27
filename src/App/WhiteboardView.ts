import { putScenes } from "../Utils/Common";
import { Val } from "value-enhancer";
import { pick } from "lodash";

import type { ReadonlyVal } from "value-enhancer";
import type { AddPageParams, PageController, PageState } from "../Page";
import type { AppProxy } from "./AppProxy";
import type { AppContext } from "./AppContext";
import type { View } from "white-web-sdk";
import type { TeleBoxRect } from "@netless/telebox-insider";
import type { ICamera } from "../AttributesDelegate";

export type WhiteBoardViewCamera = Omit<ICamera, "scale" | "id">;

export class WhiteBoardView implements PageController {
    public readonly pageState$: ReadonlyVal<PageState>;
    public readonly camera$: ReadonlyVal<WhiteBoardViewCamera>;

    constructor(
        public view: View,
        protected appContext: AppContext,
        protected appProxy: AppProxy,
        public ensureSize: (size: number) => void
    ) {
        const pageState$ = new Val<PageState>(appProxy.pageState);
        this.pageState$ = pageState$;
        this.appProxy.sideEffectManager.add(() =>
            appProxy.appEmitter.on("pageStateChange", pageState => {
                pageState$.setValue(pageState);
            })
        );
        const camera$ = new Val<WhiteBoardViewCamera>(
            pick(this.view.camera, ["centerX", "centerY"])
        );
        this.camera$ = camera$;
        this.appProxy.sideEffectManager.add(() =>
            appProxy.camera$.subscribe(camera => {
                if (camera) {
                    camera$.setValue(pick(camera, ["centerX", "centerY"]));
                }
            })
        );
        view.disableCameraTransform = true;
    }

    public get pageState() {
        return this.pageState$.value;
    }

    public moveCamera(camera: Partial<WhiteBoardViewCamera>) {
        this.appProxy.moveCamera(camera);
    }

    public nextPage = async (): Promise<boolean> => {
        const nextIndex = this.pageState.index + 1;
        return this.jumpPage(nextIndex);
    };

    public prevPage = async (): Promise<boolean> => {
        const nextIndex = this.pageState.index - 1;
        return this.jumpPage(nextIndex);
    };

    public jumpPage = async (index: number): Promise<boolean> => {
        if (index < 0 || index >= this.pageState.length) {
            console.warn(`[WindowManager]: index ${index} out of range`);
            return false;
        }
        this.appProxy.setSceneIndex(index);
        return true;
    };

    public addPage = async (params?: AddPageParams) => {
        const after = params?.after;
        const scene = params?.scene;
        const scenePath = this.appProxy.scenePath;
        if (!scenePath) return;
        if (after) {
            const nextIndex = this.pageState.index + 1;
            putScenes(this.appContext.room, scenePath, [scene || {}], nextIndex);
        } else {
            putScenes(this.appContext.room, scenePath, [scene || {}]);
        }
    };

    public removePage = async (index?: number): Promise<boolean> => {
        const needRemoveIndex = index === undefined ? this.pageState.index : index;
        if (this.pageState.length === 1) {
            console.warn(`[WindowManager]: can not remove the last page`);
            return false;
        }
        if (needRemoveIndex < 0 || needRemoveIndex >= this.pageState.length) {
            console.warn(`[WindowManager]: page index ${index} out of range`);
            return false;
        }
        return this.appProxy.removeSceneByIndex(needRemoveIndex);
    };

    public setRect(rect: Omit<TeleBoxRect, "x" | "y">) {
        this.appProxy.updateSize(rect.width, rect.height);
    }
}