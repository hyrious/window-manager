import { memoize } from "lodash";
import { emitter } from "../index";
import type { AppManager } from "../AppManager";

export class Context {
    public observerId: number;

    constructor(private manager: AppManager) {
        this.observerId = manager.displayer.observerId;

        emitter.on("observerIdChange", id => {
            this.observerId = id;
        });
    };

    public get uid() {
        return this.memoizeFindMember(this.observerId)?.payload?.uid || "";
    }

    private findMember =  (memberId: number) => {
        const roomMembers = this.manager.room?.state.roomMembers;
        return roomMembers?.find(member => member.memberId === memberId);
    }

    public memoizeFindMember = memoize(this.findMember);

    public updateManagerRect() {
        this.manager.boxManager.updateManagerRect();
    }

    public blurFocusBox() {
        this.manager.boxManager.blurFocusBox();
    }

    public switchAppToWriter(id: string) {
        this.manager.viewManager.switchAppToWriter(id);
    }
}

let context: Context;

export const createContext = (manager: AppManager) => {
    if (!context) {
        context = new Context(manager);
    }
    return context;
};
