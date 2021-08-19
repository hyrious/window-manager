import React from 'react';
import ReactDOM from 'react-dom';
import { AnimationMode } from 'white-web-sdk';
import { AppContext } from './AppContext';
import { View } from "./typings";

type PPTWrapperProps = {
    view?: View;
    // scenes: { name: string }[];
    initScenePath: string;
    updateAttr: (keys: string[], attr: any) => void;
};

type PPTWrapperState = {
    page: number;
};

class PPTWrapper extends React.Component<PPTWrapperProps, PPTWrapperState> {
    private wrapperRef: HTMLDivElement | null = null;
    private viewRef: HTMLDivElement | null = null;

    constructor(props: PPTWrapperProps) {
        super(props);
        this.state = {
            page: 1,
        };
    }

    componentDidMount() {
        console.log(this.props);
    }

    setRef = (ref: HTMLDivElement) => {
        this.viewRef = ref;
        // this.props.view.divElement = ref;
        // this.props.view.focusScenePath = `${this.props.initScenePath}/${this.props.scenes[0].name}`;
    };


    // nextPage = () => {
    //     this.setState({ page: this.state.page + 1 });
    //     this.props.view.focusScenePath = `${this.props.initScenePath}/${this.getCurrentPathName()}`;
    // }

    // getCurrentPathName = () => {
    //     return this.props.scenes[this.state.page - 1]?.name;
    // }

    setWrapperRef = (ref: HTMLDivElement) => {
        this.wrapperRef = ref;
    };

    render() {
        return (
            <div
                ref={this.setWrapperRef}
                onClick={() => {
                    this.props.updateAttr(["a"], 10);
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <div ref={this.setRef} style={{ width: "100%", height: "100%" }}></div>
            </div>
        );
    }
}

export default {
    kind: "PPTPlugin",
    config: {
        enableView: true,
    },
    setup: (context: AppContext) => {
        console.log("setup", context);
        // console.log(context.getScenes());

        // context.setAttributes({ aaaaa: 1 });
        // context.emit("setBoxSize", { width: 400, height: 400 });
        context.emitter.on("attributesUpdate", (attributes: any) => {
            console.log("attributesUpdate", attributes);
        });
        console.log("isWritable", context.getIsWritable());
        context.emitter.on("sceneStateChange", (state: any) => {
            // console.log(state);
        });
        // const view = context.getView();
        // view.callbacks.on("onSizeUpdated", () => {
        //     const scenes = context.getScenes();
        //     if (scenes) {
        //         const scene = scenes[0];
        //         if (scene.ppt) {
        //             const { width, height } = scene.ppt;
        //             view.moveCameraToContain({
        //                 originX: -width / 2,
        //                 originY: -height / 2,
        //                 width, height,
        //                 animationMode: AnimationMode.Immediately
        //             })
        //         }
        //     }
        // })
        context.setAttributes({ a:1, b:2 });
        setTimeout(() => {
            context.updateAttributes(["a"], 3);
        }, 2000)
        // const box = context.getBox();
        // console.log("context context", box?.$content);
        // if (box) {
            // const view = context.getView()!;
            // const initScenePath = context.getInitScenePath();
            // ReactDOM.render(
            //     <PPTWrapper
            //         view={view}
            //         updateAttr={(keys, attr) => context.updateAttributes(keys, attr)}
            //         initScenePath={initScenePath!}
            //     />,
            //     box.$content!
            // );
        // }
        // context.emitter.emit("setBoxTitle", { title: "ppt1" });
        // console.log("context footer", box?.$footer);
    },
};
