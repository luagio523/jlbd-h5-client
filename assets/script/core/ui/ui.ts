import { assert, log } from "cc";
import { LRUCache } from "./cache";
import { DefaultAssetsIdleTime, DefaultUIIdleTime, IUIConfig, ResourceType } from "./config";
import { FairyGUILayerManager, ILayerManager, UILayer } from "./layer";
import { CocosCreatorAssetsRelease, CocosCreatorUIRelease, FairyGuiPackageRelease, FairyGuiUIRelease, loaderUI } from "./loader";
import { IViewMediator, MediatorFactory } from "./mediator";

interface IUIManager {
    // 打开UI界面
    open(uiId: string, uiLayer: UILayer, ...params: any[]): void;
    // 关闭UI界面
    close(uiId: string): void;
    // 获取UI界面实例
    get(uiId: string): any | undefined;
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




class UIFactory {
    public static loadAndCreateUI(config: IUIConfig): Promise<any> {
        if (!config) {
            return Promise.reject(new Error(`No UI configuration found for ${config.uiId}`));
        }
        return loaderUI(config).then(uiInstance => {
            return uiInstance;
        });
    }
}


// 示例的UI管理器实现
export class UIManager implements IUIManager {
    private uiInstances: Map<string, any>;
    private mediators: Map<string, IViewMediator>;
    private lruCache: LRUCache
    private layerManager: ILayerManager

    constructor() {
        this.uiInstances = new Map<string, any>();
        this.mediators = new Map<string, IViewMediator>();
        this.lruCache = new LRUCache()
        this.layerManager = new FairyGUILayerManager()
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
        const config = UI_CONFIG[uiId];
        assert(!!config, `config is not exist,plz check uiId:${uiId}`);
        let uiInstance = this.uiInstances.get(uiId);
        return new Promise((resolve, reject) => {
            if (!uiInstance) {
                const instanceId = this.genInstanceId(config);
                UIFactory.loadAndCreateUI(config)
                    .then((loadedUIInstance) => {
                        this.uiInstances.set(instanceId, loadedUIInstance);
                        this.addUIToLayer(loadedUIInstance, uiLayer);
                        loadedUIInstance.name = instanceId;
                        let mediator = MediatorFactory.create(config.mediatorClass, loadedUIInstance);
                        this.mediators.set(instanceId, mediator);
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
        const mediator = this.mediators.get(instanceId);
        const config = UI_CONFIG[uiId]
        if (!config || !uiInstance || !mediator) {
            log(`close fail,plz check instanceId:${instanceId},uiId:${uiId}`)
            return
        }

        mediator.dispose();
        this.mediators.delete(instanceId);

        this.layerManager.removeFromLayer(uiInstance, config.uiLayer) //移除
        const resourceType = config.resourceType ?? ResourceType.FairyGuiComponent; // 使用默认值
        const uiIdleTime = config.uiIdleTime ?? DefaultUIIdleTime
        const assetsIdleTime = config.uiIdleTime ?? DefaultAssetsIdleTime
        switch (resourceType) {
            case ResourceType.CocosCreatorPrefab:
                this.lruCache.put(new CocosCreatorUIRelease(uiInstance, instanceId, uiIdleTime))
                this.lruCache.put(new CocosCreatorAssetsRelease(config.resourcePath, assetsIdleTime))
            case ResourceType.FairyGuiComponent:
                this.lruCache.put(new FairyGuiUIRelease(uiInstance, instanceId, uiIdleTime))
                this.lruCache.put(new FairyGuiPackageRelease(config.resourcePath, assetsIdleTime))
            default: // 
        }
    }


    public get(instanceId: string): any | undefined {
        return this.uiInstances.get(instanceId);
    }

}