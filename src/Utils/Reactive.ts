import { isObject } from "lodash";
import { listenUpdated, reaction, unlistenUpdated, UpdateEventKind } from "white-web-sdk";
import type { AkkoObjectUpdatedProperty, AkkoObjectUpdatedListener } from "white-web-sdk";
import type { Val } from "value-enhancer";

// 兼容 13 和 14 版本 SDK
export const onObjectByEvent = (event: UpdateEventKind) => {
    return (object: any, func: () => void) => {
        if (object === undefined) return;
        if (listenUpdated) {
            const listener = (events: readonly AkkoObjectUpdatedProperty<any>[]) => {
                const kinds = events.map(e => e.kind);
                if (kinds.includes(event)) {
                    func();
                }
            };
            listenUpdated(object, listener);
            func();
            return () => unlistenUpdated(object, listener);
        } else {
            return reaction(
                () => object,
                () => {
                    func();
                },
                {
                    fireImmediately: true,
                }
            );
        }
    };
};

export const safeListenPropsUpdated = <T>(
    getProps: () => T,
    callback: AkkoObjectUpdatedListener<T>,
    onDestroyed?: (props: unknown) => void
) => {
    let disposeListenUpdated: (() => void) | null = null;
    const disposeReaction = reaction(
        getProps,
        () => {
            if (disposeListenUpdated) {
                disposeListenUpdated();
                disposeListenUpdated = null;
            }
            const props = getProps();
            if (isObject(props)) {
                disposeListenUpdated = () => unlistenUpdated(props, callback);
                listenUpdated(props, callback);
            } else {
                onDestroyed?.(props);
            }
        },
        { fireImmediately: true }
    );

    return () => {
        disposeListenUpdated?.();
        disposeReaction();
    };
};

export const onObjectRemoved = onObjectByEvent(UpdateEventKind.Removed);
export const onObjectInserted = onObjectByEvent(UpdateEventKind.Inserted);

export const createValSync = <T>(expr: any, Val: Val<T, boolean>, isAddApp: boolean): (() => void) => {
    let skipUpdate = false;
    return reaction(
        expr,
        val => {
            if (isAddApp && !skipUpdate) {
                skipUpdate = true;
            } else {
                Val.setValue(val as T);
            }
        },
        { fireImmediately: true }
    );
};
