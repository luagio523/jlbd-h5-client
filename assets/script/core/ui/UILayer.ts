import { Node } from "cc";
import { GObject } from "fairygui-cc";



export interface ILayerManager {
    // initLayers(root: any): void; // 初始化各个层的容器
    addToLayer(uiInstance: any, layer: UILayer): void; // 将UI组件添加到指定层
    removeFromLayer(uiInstance: GObject|Node, layer: UILayer): void
    hideUILayer(layer: UILayer): void
    showUILayer(layer: UILayer): void
}


// UI层枚举，根据UI资源类型分层
export enum UILayer {
    BACKGROUND, // 背景层
    MAIN,       // 主层
    DIALOG,    //模式窗口层
    TOP         // 顶层
}




