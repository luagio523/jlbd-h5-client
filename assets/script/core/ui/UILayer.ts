import { Node } from "cc";
import { GObject } from "fairygui-cc";



export interface ILayerManager {
    addToLayer(uiInstance: any, layer: UILayer): void; // 将UI组件添加到指定层
    removeFromLayer(uiInstance: GObject|Node, layer: UILayer): void
    hideUILayer(layer: UILayer): void
    showUILayer(layer: UILayer): void
    isUIInLayer(uiInstance: GObject|Node, layer: UILayer): boolean
}


// UI层枚举，根据UI资源类型分层
export enum UILayer {
    BACKGROUND, // 背景层
    MAIN,       // 主层
    DIALOG,    //模式窗口层
    TOAST,      // 提示层
    TOP         // 顶层
}




