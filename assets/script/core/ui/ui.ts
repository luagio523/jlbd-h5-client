import { assert, js, log } from "cc";
import { LRUCache } from "./cache";
import { DefaultAssetsIdleTime, DefaultUIIdleTime, IUIConfig, ResourceType } from "./config";
import { FairyGUILayerManager, ILayerManager, UILayer } from "./layer";
import { FairyGuiLoader, FairyGuiPackageRelease, FairyGuiUIRelease, IUILoader } from "./loader";


// 
export interface IViewMediator {
   initialize(instanceId :string): void;
   open(...params: any[]): void; 
   dispose(): void; 
 }


export class MediatorFactory {
    public static create(mediatorClassName: string,mediatorName:string, uiInstance: any): IViewMediator {
        const MediatorClass = js.getClassByName(mediatorClassName) as new (mediatorName:string,uiInstance: any) => IViewMediator;
        if (!MediatorClass) {
            throw new Error(`Mediator class not found: ${mediatorClassName}`);
        }
        return new MediatorClass(mediatorName,uiInstance);
    }
}

interface IFacade {
    registerMediator(mediator: any): void;
    retrieveMediator(instanceId: string): any;
    removeMediator(instanceId:string):void 
}


// 配置对象更新成包含loader方法
const UI_CONFIG: { [uiId: string]: IUIConfig } = {
    "loginUI": {
        uiId: "loginUI",
        uiLayer: UILayer.BACKGROUND,
        mediatorClass: "LoginMediator",
        resourcePath: "res/Login",
        resourceType: ResourceType.FairyGuiComponent,
    },
};





// UI管理器实现
export class UIManager  {
    private uiInstances: Map<string, any>;
    private lruCache: LRUCache
    private layerManager: ILayerManager
    private facade:IFacade 
    private UI_CONFIG:{ [uiId: string]: IUIConfig }
    private uiLoader:IUILoader
    constructor(facade:IFacade) {
        this.uiInstances = new Map<string, any>();
        this.facade = facade
        this.lruCache = new LRUCache()
        this.layerManager = new FairyGUILayerManager()
        this.uiLoader = new FairyGuiLoader()
    }


    public initialize(configs:{ [uiId: string]: IUIConfig }):UIManager{
        this.UI_CONFIG = configs 
        return this 
    }

    public loadUI(config: IUIConfig): Promise<any> {
        return this.uiLoader.load(config)
    }
    

    private instanceCounter: number = 0;
    private genInstanceId(config:IUIConfig): string {
        const repeat = config.uiRepeat??false //是否允许重复
        this.instanceCounter += 1;
        if (repeat){
            return `${config.uiId}_${this.instanceCounter}`;
        }
        return config.uiId
    }

    private getUiIdFromInstanceId(instanceId: string): string {
        const parts = instanceId.split('_');
        return parts[0];
    }


    public open(uiId: string, uiLayer: UILayer, ...params: any[]): Promise<string> {
        const config = this.UI_CONFIG[uiId];
        assert(!!config, `config is not exist,plz check uiId:${uiId}`);
        let uiInstance = this.uiInstances.get(uiId);
        return new Promise((resolve, reject) => {
            if (!uiInstance) {
                const instanceId = this.genInstanceId(config);
                this.loadUI(config)
                    .then((loadedUIInstance) => {
                        this.uiInstances.set(instanceId, loadedUIInstance);
                        this.addUIToLayer(loadedUIInstance, uiLayer);
                        let mediator = MediatorFactory.create(config.mediatorClass,instanceId, loadedUIInstance);
                        this.facade.registerMediator( mediator);
                        mediator.initialize(instanceId);
                        mediator.open(...params);
                        resolve(instanceId);
                    })
                    .catch((error) => {
                        // 处理加载或创建UI实例时出现的错误
                        reject(error);
                    });
            } else {
                resolve(uiId);
            }
        })
    }

    private addUIToLayer(uiInstance: any, uiLayer: UILayer): void {
        this.layerManager.addToLayer(uiInstance, uiLayer)
    }

    public close(instanceId: string): void {
        const uiId = this.getUiIdFromInstanceId(instanceId)
        const uiInstance = this.uiInstances.get(instanceId);
        const mediator = this.facade.retrieveMediator(instanceId);
        const config = this.UI_CONFIG[uiId]
        if (!config || !uiInstance || !mediator) {
            log(`close fail,plz check instanceId:${instanceId},uiId:${uiId}`)
            return
        }

        mediator.dispose();
        this.facade.removeMediator(instanceId);

        this.layerManager.removeFromLayer(uiInstance, config.uiLayer) //移除
       
        const uiIdleTime = config.uiIdleTime ?? DefaultUIIdleTime
        const assetsIdleTime = config.assetIdleTime ?? DefaultAssetsIdleTime
        this.lruCache.put(new FairyGuiUIRelease(uiInstance, instanceId, uiIdleTime))
        this.lruCache.put(new FairyGuiPackageRelease(config.resourcePath, assetsIdleTime))
    }


    public get(instanceId: string): any | undefined {
        return this.uiInstances.get(instanceId);
    }

}