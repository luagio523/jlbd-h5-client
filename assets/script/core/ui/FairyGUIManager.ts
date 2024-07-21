import { GComponent, GObject, GRoot, UIPackage, Window } from "fairygui-cc";
import { ILayerManager, UILayer } from "./UILayer";
import { IUIConfig } from "./UIConfig";
import { IResManager, UIResBase } from "./UIRes";
import scheduler from "../../utils/scheduler";
import { Node, sys } from "cc";

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



export class FairyGUIManager implements ILayerManager {
   
    private _root: GRoot;
    private _layers: Map<UILayer, GComponent>;

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

        const layerNode = this._layers.get(layer);
        if (!layerNode) {
            console.error(`Layer ${UILayer[layer]} not initialized.`);
            return;
        }

        switch (layer) {
            case UILayer.BACKGROUND:
            case UILayer.MAIN:
                uiInstance.makeFullScreen(); // 全屏即可自动适配
                layerNode.addChild(uiInstance);
                break;
            case UILayer.TOP:
                layerNode.addChild(uiInstance);
                this.adjustTopLayer();
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
            console.warn(`Layer ${UILayer[layer]} is managed by FairyGUI or not initialized.`);
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
            console.warn(`Layer ${UILayer[layer]} is managed by FairyGUI or not initialized.`);
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
            console.warn(`Layer ${UILayer[layer]} is managed by FairyGUI or not initialized.`);
            return false;
        }
    }

    public clearLayer(layer: UILayer): void {
        const layerNode = this._layers.get(layer);
        if (layerNode) {
            layerNode.removeChildren();
        } else {
            console.warn(`Layer ${UILayer[layer]} is managed by FairyGUI or not initialized.`);
        }
    }
}


export class FairyGuiResManager implements IResManager<GComponent> {

    private static instance: FairyGuiResManager;

    public static getInstance(): FairyGuiResManager {
        if (!FairyGuiResManager.instance) {
            FairyGuiResManager.instance = new FairyGuiResManager();
        }
        return FairyGuiResManager.instance;
    }

    private resMap: Map<string, FairyGuiUIRes> = new Map<string, FairyGuiUIRes>();

    public constructor(){
        scheduler.scheduleGlobal(this.cleanup.bind(this), 10)// 例如每30秒清理一次
    }

    // 清理函数，会根据设置的时间阈值来释放实例和资源
    private cleanup() {
        const now = sys.now();
        for (const [uiId, uiRes] of this.resMap.entries()) {
            if (uiRes.checkIdle(now)) {
                this.resMap.delete(uiId);
            }
        }
    }

    async create(config: IUIConfig): Promise<GComponent> {
        if (!config.uiId || !config.resourcePath || !config.uiComponentName) {
            throw new Error("Invalid UI config provided.");
        }
        if (!this.resMap.has(config.uiId)) {
            this.resMap.set(config.uiId, new FairyGuiUIRes(config));
        }
        let res = this.resMap.get(config.uiId);
        if (res) {
            const component = await res.get();
            if (component) {
                return component;
            }
        }
    }
   
    getUIRes(uiId:string ):FairyGuiUIRes{
        return  this.resMap.get(uiId)
    }

    release(uiId:string,uiInstance:GComponent):void{
        this.resMap.get(uiId)?.put(uiInstance)
    }
}



class FairyGuiUIRes extends UIResBase<GComponent> {
   
    protected release(config: IUIConfig) {
        this.instanceList.forEach((instance: GComponent) => {
            instance.dispose();
        });
        this.instanceList = [];
        UIPackage.removePackage(config.resourcePath);
    }


    protected async createInstance(config: IUIConfig): Promise<GComponent> {
        const uiPackage = await this.load(config.resourcePath);
        const component = UIPackage.createObject(uiPackage.name, config.uiComponentName);
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