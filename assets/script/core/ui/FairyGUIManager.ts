import { GComponent, GObject, GRoot, UIPackage, Window } from "fairygui-cc";
import { ILayerManager, UILayer } from "./UILayer";
import { IUIConfig } from "./UIConfig";
import { IResManager, UIResBase } from "./UIRes";
import scheduler from "../../utils/scheduler";
import { sys } from "cc";
export class FairyGUIManager implements ILayerManager {
    private static instance: FairyGUIManager;

    public static getInstance(): FairyGUIManager {
        if (!FairyGUIManager.instance) {
            FairyGUIManager.instance = new FairyGUIManager();
        }
        return FairyGUIManager.instance;
    }

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

    private initFaiyGUI(){
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














export class FairyGuiResManager implements IResManager<GComponent> {

    private static instance: FairyGuiResManager;

    public static getInstance(): FairyGuiResManager {
        if (!FairyGuiResManager.instance) {
            FairyGuiResManager.instance = new FairyGuiResManager();
        }
        return FairyGuiResManager.instance;
    }


    private resMap:{ [uiId: string]: FairyGuiUIRes }

    public constructor(){
        this.resMap = {}
        scheduler.scheduleGlobal(this.cleanup.bind(this), 10)// 例如每30秒清理一次
    }

    // 清理函数，会根据设置的时间阈值来释放实例和资源
    private cleanup() {
        const now = sys.now();
        for (let uiId in this.resMap) {
            let res = this.resMap[uiId]
            if(res.clean(now)){
                delete this.resMap[uiId]
            }
        }
    }

    async load(config: IUIConfig): Promise<GComponent> {
        try {
            // 检查缓存中是否存在资源
            let res = this.resMap[config.uiId];
            if (res) {
                const component = res.get();
                if (component) {
                    return component;
                }
            }

            // 如果缓存中不存在资源，则加载并生成一个新的UIRes
            if (!res) {
                res = new FairyGuiUIRes(config);
                this.resMap[config.uiId] = res;
            }

            const uiPackage = await this.loadPackage(config.resourcePath);
            const component = UIPackage.createObject(uiPackage.name, config.uiComponentName);
            
            if (component instanceof GComponent) {
                return component;
            } else {
                throw new Error("UI component created is not a GComponent");
            }

        } catch (error) {
            throw error;
        }
    }


    private loadPackage(resourcePath: string): Promise<UIPackage> {
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
    
   
    getUIRes(uiId:string ):FairyGuiUIRes{
        return  this.resMap[uiId]
    }

    release(uiId:string,uiInstance:GComponent):void{
        this.getUIRes(uiId)?.put(uiInstance)
    }
}



class FairyGuiUIRes extends UIResBase<GComponent> {
    protected cleanUI() {
        this.instanceList.forEach((instance: GComponent) => {
            instance.dispose();
        });
        this.instanceList = [];
    }

    protected cleanAssets(resourcePath: string) {
        UIPackage.removePackage(resourcePath);
    }
}