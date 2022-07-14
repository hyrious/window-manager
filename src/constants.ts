export enum Events {
    AppMove = "AppMove",
    AppFocus = "AppFocus",
    AppResize = "AppResize",
    AppBoxStateChange = "AppBoxStateChange",
    GetAttributes = "GetAttributes",
    UpdateWindowManagerWrapper = "UpdateWindowManagerWrapper",
    WindowCreated = "WindowCreated",
    SetMainViewScenePath = "SetMainViewScenePath",
    SetMainViewSceneIndex = "SetMainViewSceneIndex",
    SetAppFocusIndex = "SetAppFocusIndex",
    SwitchViewsToFreedom = "SwitchViewsToFreedom",
    CursorMove = "CursorMove",
    RootDirRemoved = "RootDirRemoved",
    Refresh = "Refresh",
    InitMainViewCamera = "InitMainViewCamera",
    InvokeAttributesUpdateCallback = "InvokeAttributesUpdateCallback",
    MoveCamera = "MoveCamera",
    MoveCameraToContain = "moveCameraToContain",
}

export const MagixEventName = "__WindowManger";
export const EnsureReconnectEvent = "__WindowMangerEnsureReconnected__";

export enum AppAttributes {
    Size = "size",
    Position = "position",
    SceneIndex = "SceneIndex",
    ZIndex = "zIndex",
    Visible = "visible",
    Ratio = "ratio",
    StageRatio = "stageRatio",
    Draggable = "draggable",
    Resizable = "resizable",
}

export enum AppEvents {
    setBoxSize = "setBoxSize",
    setBoxMinSize = "setBoxMinSize",
    destroy = "destroy",
}

export enum AppStatus {
    StartCreate = "StartCreate",
}

export enum CursorState {
    Leave = "leave",
    Normal = "normal",
}

export const REQUIRE_VERSION = "2.16.1";

export const MIN_WIDTH = 340 / 720;
export const MIN_HEIGHT = 340 / 720;

export const SET_SCENEPATH_DELAY = 100; // 设置 scenePath 的延迟事件

export const DEFAULT_CONTAINER_RATIO = 9 / 16;

export const ROOT_DIR = "/";
export const INIT_DIR = "/init";

export const SETUP_APP_DELAY = 50;

export const MAX_PAGE_SIZE = 500;
