import { callbacks } from "./index";
import { Events, MagixEventName } from "./constants";
import type { Event } from "white-web-sdk";
import type { AppManager } from "./AppManager";
import type { TeleBoxState } from "@netless/telebox-insider";

export class AppListeners {
    private displayer = this.manager.displayer;
    private boxManager = this.manager.boxManager;

    constructor(private manager: AppManager) {}

    public addListeners() {
        this.displayer.addMagixEventListener(MagixEventName, this.mainMagixEventListener);
    }

    public removeListeners() {
        this.displayer.removeMagixEventListener(MagixEventName, this.mainMagixEventListener);
    }

    private mainMagixEventListener = (event: Event) => {
        if (event.authorId !== this.displayer.observerId) {
            const data = event.payload;
            switch (data.eventName) {
                case Events.AppMove: {
                    this.appMoveHandler(data.payload);
                    break;
                }
                case Events.AppResize: {
                    this.appResizeHandler(data.payload);
                    break;
                }
                case Events.AppBoxStateChange: {
                    this.boxStateChangeHandler(data.payload);
                    break;
                }
                default:
                    break;
            }
        }
    };

    private appMoveHandler = (payload: any) => {
        this.boxManager.moveBox(payload);
    };

    private appResizeHandler = (payload: any) => {
        this.boxManager.resizeBox(Object.assign(payload, { skipUpdate: true }));
        this.manager.room?.refreshViewSize();
    };

    private boxStateChangeHandler = (state: TeleBoxState) => {
        callbacks.emit("boxStateChange", state);
    };
}
