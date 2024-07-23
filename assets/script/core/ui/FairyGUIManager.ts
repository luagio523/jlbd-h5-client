import { EaseType, GComponent, GObject, GRoot, GTween, RelationType, UIPackage, Window } from "fairygui-cc";
import { ILayerManager, UILayer } from "./UILayer";
import { IUIConfig } from "./UIConfig";
import { AbstractResManager, IResManager, UIResBase } from "./UIRes";
import { Asset, Node, Texture2D, assetManager, resources, sys } from "cc";

// private initFaiyGUI(){
    //UIConfig.defaultFont = 'Droid Sans Fallback';
    //UIConfig.windowModalWaiting = ""
    //UIConfig.globalModalWaiting= ""
    //UIConfig.buttonSound= ""
    //UIConfig.buttonSoundVolumeScale= 0.5
    //UIConfig.horizontalScrollBar= ""
    //UIConfig.verticalScrollBar= ""
    //UIConfig.tooltipsWin = "ui://包名/组件名";
    // UIObjectFactory.SetLoaderExtension(typeof(MyGLoader));
    //UIPackage.loadPackage(ResPath.UI+"BlueSkin",()=>{}); //for test
    //UIPackage.loadPackage(ResPath.UI+"Common",()=>{}); //for test
   
//    GRoot.create();
//    addLoadHandler();
//     //GRoot.inst.volumeScale = 0;
//    GRoot.inst.modalLayer.touchable = true;
//    UIConfig.modalLayerColor = new cc.Color(0,0,0,170);
//    UIConfig.bringWindowToFrontOnClick = false;
//    UIConfig.buttonSound = "ui://Battle/buttonSound";

    // //UIObjectFactory.setLoaderExtension(Loader);
    
    //UIConfig.bringWindowToFrontOnClick = false;
    //UIConfig.modalLayerColor = new cc.Color(0,0,0,170);
    // //GRoot.create(); //会将 director.getScene() 做为 root父节点
    //GRoot.inst.modalLayer.touchable = true
    //GRoot.inst.volumeScale = 0;
    // //InputProcessor

    // if(GameGlobal.OPEN_TRADITIONAL) {
    //    UIPackage.branch = "fanti";
    // }
    // else if(GameGlobal.CHANNEL_ID == CHANNEL_ID.SBGDY) {
    //    UIPackage.branch = "gdy";
    // }
    //UIConfig.defaultFont = "方正兰亭圆简体";
    // FguiRegister();
// }




// 重写 dispose 方法
const originalDispose = UIPackage.prototype.dispose;
UIPackage.prototype.dispose = function() {
    const cnt = this._items.length;
    for (let i = 0; i < cnt; i++) {
        const pi = this._items[i];
        if (pi.file) {
            let asset: Asset =  resources.get(pi.file)
            if(asset){
                // console.log(`资源引用计数:${asset.name},${asset.nativeUrl}:${asset.refCount}`,asset);
                if(asset.refCount > 1){
                    // console.log(`资源${asset.name}被多次引用，可能导致资源释放失败`);
                }else{
                    assetManager.releaseAsset(asset);
                }
            }
        }
    }
    originalDispose.call(this);
};


export class FairyGUIManager implements ILayerManager {
   
    private _root: GRoot;
    private _layers: Map<UILayer, GComponent>;
    private _dialogs: Window[] = [];

    public getRootNode(): Node {
        return this._root.node;
    }

    public constructor() {
        this._layers = new Map<UILayer, GComponent>();
        this.initialize();
    }

    public initialize(): void {
        //  GRoot 本身已经做了适配，适配逻辑跟AdaptionManager一样，这里不需要再次适配
        //  对于全屏的添加面板 直接 makeFullScreen() 即可。如 添加到 UILayer.BACKGROUND 上的
        this._root = GRoot.create(); 
        this.initLayerNode(UILayer.BACKGROUND, 'BackgroundLayer');
        this.initLayerNode(UILayer.MAIN, 'MainLayer');
        this.initLayerNode(UILayer.TOP, 'TopLayer');
    }

    private initLayerNode(layer: UILayer, name: string): void {
        if (this._layers.has(layer)) {
            console.warn(`Layer ${UILayer[layer]} already initialized.`);
            return;
        }

        const node = new GComponent();
        node.makeFullScreen();
        node.name = name;
        this._layers.set(layer, node);
        this._root.addChild(node);
    }

    public addToLayer(uiInstance: GObject, layer: UILayer): void {
        if (!uiInstance) {
            console.error("Invalid UI instance provided.");
            return;
        }


        switch (layer) {
            case UILayer.BACKGROUND:
                uiInstance.makeFullScreen(); // 全屏即可自动适配
                this.getLayerNode(UILayer.BACKGROUND)?.addChild(uiInstance);
                break;
            case UILayer.MAIN:
                uiInstance.makeFullScreen(); // 全屏即可自动适配
                this.getLayerNode(UILayer.MAIN)?.addChild(uiInstance);
                break;
            case UILayer.TOP:
                this.getLayerNode(UILayer.TOP)?.addChild(uiInstance);
                this.adjustTopLayer();
                break;
            case UILayer.DIALOG:
                let dialog = new CustomDiaolog(uiInstance.asCom);
                // dialog.contentPane = uiInstance.asCom;
                this._dialogs.push(dialog);
                GRoot.inst.showWindow(dialog);
                this.adjustTopLayer()
                break;
            case UILayer.TOP:
                this._layers[UILayer.TOP].addChild(uiInstance);
                this.adjustTopLayer()
                break;
            default:
                console.warn(`Layer ${UILayer[layer]} is managed by FairyGUI. Use appropriate FairyGUI methods.`);
                break;
        }
    }

    public removeFromLayer(uiInstance: GObject, layer: UILayer): void {
        if (!uiInstance) {
            console.error("Invalid UI instance provided.");
            return;
        }

        const layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.removeChild(uiInstance);
        } else {
            if (layer === UILayer.DIALOG) {
                this._dialogs.forEach((dialog) =>
                    dialog.hide()
                );
            }else{
                console.warn(`Layer ${UILayer[layer]} is managed by FairyGUI or not initialized.`);
            }
        }
    }

    public hideUILayer(layer: UILayer): void {
        this.setLayerVisibility(layer, false);
    }

    public showUILayer(layer: UILayer): void {
        this.setLayerVisibility(layer, true);
    }

    private setLayerVisibility(layer: UILayer, visible: boolean): void {
        const layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.visible = visible;
        } else {
            if (layer === UILayer.DIALOG) {
                this._dialogs.forEach((dialog) =>
                    dialog.visible = visible
                );
            } else {
                console.warn(`Layer ${UILayer[layer]} is managed by FairyGUI or not initialized.`);
            }
        }
    }

    private adjustTopLayer(): void {
        const topLayer = this._layers.get(UILayer.TOP);
        if (topLayer) {
            this._root.setChildIndex(topLayer, this._root.numChildren - 1);
        }
    }

    public getLayerNode(layer: UILayer): GComponent | null {
        return this._layers.get(layer) || null;
    }

    public isUIInLayer(uiInstance: GObject|Node, layer: UILayer): boolean {
        const layerNode = this.getLayerNode(layer);
        if (layerNode) {
            for (let i = 0; i < layerNode.numChildren; i++) {
                const child = layerNode.getChildAt(i);
                if (child === uiInstance) {
                    return true;
                }
            }
            return false;
        } else {
            if (layer === UILayer.DIALOG) {
                return this._dialogs.some((dialog) =>
                    dialog.contentPane === uiInstance
                );
            }
            console.warn(`Layer ${UILayer[layer]} is managed by FairyGUI or not initialized.`);
            return false;
        }
    }

    public clearLayer(layer: UILayer): void {
        const layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.removeChildren();
        } else {
            if (layer === UILayer.DIALOG) {
                this._dialogs.forEach((dialog) =>
                    dialog.hide()
                );
            }
            console.warn(`Layer ${UILayer[layer]} is managed by FairyGUI or not initialized.`);
        }
    }
}



export class FairyGuiResManager extends AbstractResManager<GComponent> {
    private static instance: FairyGuiResManager;

    public static getInstance(): FairyGuiResManager {
        if (!FairyGuiResManager.instance) {
            FairyGuiResManager.instance = new FairyGuiResManager();
        }
        return FairyGuiResManager.instance;
    }

    protected createUIRes(config: IUIConfig): UIResBase<GComponent> {
        return new FairyGuiUIRes(config);
    }
}



class FairyGuiUIRes extends UIResBase<GComponent> {

    public  releaseAssets(resourcePath: string): void {
        if(UIPackage.getById(resourcePath)) {   
            UIPackage.removePackage(resourcePath);
        }
        resources.release(resourcePath);
    }

    public disposeUI() {
        this.instanceList.forEach((instance: GComponent) => {
            instance.dispose();
        });
        this.instanceList = [];
    }

    protected async createInstance(config: IUIConfig): Promise<GComponent> {
        const uiPackage = await this.load(config.resourcePath);

        const component = UIPackage.createObject(uiPackage.name, config.uiComponentName);

        console.log(`load当前资源总数:${assetManager.assets.count}`);

        if (component instanceof GComponent) {
            return component;
        } else {
            throw new Error("UI component created is not a GComponent");
        }
    }

    private load(resourcePath: string): Promise<UIPackage> {
        return new Promise((resolve, reject) => {
            UIPackage.loadPackage(resourcePath, (error, uiPackage) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(uiPackage);
                }
            });
        });
    } 
        
}






/*************************************************定义一些fairygui的扩展组件*******************************************************/
class CustomDiaolog extends Window {
    constructor(contentPane: GComponent) {
        super();
        this.contentPane = contentPane;
        this.setPivot(0.5, 0.5); //设置中心锚点
        this.center(true); //设置居中
    }

    protected doShowAnimation(): void {
        this.setScale(0.1, 0.1);
        GTween.to2(0.1, 0.1, 1, 1, 0.15)
            .setTarget(this, this.setScale)
            .setEase(EaseType.BackOut)
            .onComplete(() => {
                this.onShown();
            }, this);
    }
    
    protected doHideAnimation(): void {
        GTween.to2(1, 1, 0.1, 0.1, 0.1)
            .setTarget(this, this.setScale)
            .setEase(EaseType.BackIn)
            .onComplete(() => {
                this.hideImmediately();
            }, this);
    }
    closeEventHandler(evt) { //禁用关闭按钮事件，UI的管理全部由UIManager来控制
    }
}




