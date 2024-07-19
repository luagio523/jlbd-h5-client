import { Node } from "cc";
import { GComponent, GObject, GRoot, Window } from "fairygui-cc";


export interface ILayerManager {
    initLayers(root: any): void; // 初始化各个层的容器
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

export class FairyGUILayerManager implements ILayerManager {
    private _root: GRoot;
    private _layers: Map<UILayer, GComponent>;
    private _dialogs: Window[] = [];

    public initLayers(root: GRoot): void {
        this._root = root;
        // 初始化各层的节点
        this.initLayerNode(UILayer.BACKGROUND, 'BackgroundLayer');
        this.initLayerNode(UILayer.MAIN, 'MainLayer');
        //   this.initLayerNode(UILayer.POPUP, 'PopupLayer');
        //   this.initLayerNode(UILayer.DIALOG, 'DialogLayer');
        this.initLayerNode(UILayer.TOP, 'TopLayer');
    }

    private initLayerNode(layer: UILayer, name: string): void {
        let node = new GComponent();
        node.name = name
        this._layers.set(layer, node);
        this._root.addChild(node);


    }

    public addToLayer(uiInstance: GObject, layer: UILayer): void {

        switch (layer) {
            case UILayer.BACKGROUND:
                this._layers[layer].addChild(uiInstance)
            case UILayer.MAIN:
                this._layers[layer].addChild(uiInstance)
                break;
            case UILayer.DIALOG:
                let dialog = new Window();
                dialog.contentPane = uiInstance.asCom;
                this._dialogs.push(dialog);
                GRoot.inst.showWindow(dialog);
                this.adjustTopLayer()
                break;
            case UILayer.TOP:
                this._layers[UILayer.TOP].addChild(uiInstance);
                this.adjustTopLayer()
                break;
            default:
                GRoot.inst.addChild(uiInstance);
                break;
        }
    }


    public removeFromLayer(uiInstance: GObject, layer: UILayer): void {
        switch (layer) {
            case UILayer.DIALOG:
                this._dialogs.forEach((dialog) =>
                    dialog.hide()
                );
                break;
            default:
                let layerNode = this._layers.get(layer);
                if (layerNode) {
                    layerNode.removeChild(uiInstance);
                } else {
                    console.error(`Layer - ${UILayer[layer]} not initialized.`);
                }
        }
    }



    public hideUILayer(layer: UILayer): void {
        switch (layer) {
            case UILayer.DIALOG:
                this._dialogs.forEach((dialog) =>
                    dialog.visible = false);
                break;
            default:
                let layerNode = this._layers.get(layer);
                if (layerNode) {
                    layerNode.visible = false;
                } else {
                    console.error(`Layer - ${UILayer[layer]} not initialized.`);
                }
        }
    }

    public showUILayer(layer: UILayer): void {
        switch (layer) {
            case UILayer.DIALOG:
                this._dialogs.forEach((dialog) =>
                    dialog.visible = true);
                break;
            default:
                let layerNode = this._layers.get(layer);
                if (layerNode) {
                    layerNode.visible = true;
                } else {
                    console.error(`Layer - ${UILayer[layer]} not initialized.`);
                }
        }
    }

    private adjustTopLayer(): void {
        GRoot.inst.setChildIndex(this._layers[UILayer.TOP], GRoot.inst.numChildren - 1);
    }
}


export class CocosCreatorLayerManager implements ILayerManager {
    private _root: Node;
    private _layers: Map<UILayer, Node>;

    public initLayers(root: Node): void {
        this._root = root;
        this._layers = new Map<UILayer, Node>();

        // 初始化各层的节点
        this.initLayerNode(UILayer.BACKGROUND, 'BackgroundLayer');
        this.initLayerNode(UILayer.MAIN, 'MainLayer');
        this.initLayerNode(UILayer.DIALOG, 'DialogLayer');
        this.initLayerNode(UILayer.TOP, 'TopLayer');
    }

    private initLayerNode(layer: UILayer, name: string): void {
        let node = new Node(name);
        this._layers.set(layer, node);
        this._root.addChild(node);
    }

    public addToLayer(uiInstance: Node, layer: UILayer): void {
        let layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.addChild(uiInstance);
        } else {
            console.error("Layer not initialized for Cocos Creator.");
        }
    }

    public removeFromLayer(uiInstance: Node, layer: UILayer): void {
        let layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.removeChild(uiInstance);
        } else {
            console.error(`Layer - ${UILayer[layer]} not initialized.`);
        }
    }

    public hideUILayer(layer: UILayer): void {
        let layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.active = false;
        } else {
            console.error(`Layer - ${UILayer[layer]} not initialized.`);
        }
    }

    public showUILayer(layer: UILayer): void {
        let layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.active = true;
        } else {
            console.error(`Layer - ${UILayer[layer]} not initialized.`);
        }
    }
}