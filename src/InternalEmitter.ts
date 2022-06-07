import Emittery from "emittery";
import type { AppInitState, CursorMovePayload } from "./index";

export type RemoveSceneParams = {
    scenePath: string, index?: number
}

export type EmitterEvent = {
    onCreated: undefined;
    InitReplay: AppInitState;
    move: { appId: string; x: number; y: number };
    focus: { appId: string };
    close: { appId: string };
    resize: { appId: string; width: number; height: number; x?: number; y?: number };
    error: Error;
    seekStart: undefined;
    seek: number;
    mainViewMounted: undefined;
    observerIdChange: number;
    boxStateChange: string;
    playgroundSizeChange: DOMRect;
    startReconnect: undefined;
    onReconnected: undefined;
    removeScenes: RemoveSceneParams;
    cursorMove: CursorMovePayload;
    updateManagerRect: undefined;
    focusedChange: { focused: string | undefined; prev: string | undefined };
    rootDirRemoved: undefined;
    setReadonly: boolean;
    changePageState: undefined;
    writableChange: boolean;
    containerSizeRatioUpdate: number;
};

export type EmitterType = Emittery<EmitterEvent>;
export const emitter: EmitterType = new Emittery();
