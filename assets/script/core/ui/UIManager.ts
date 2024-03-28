import { Camera, assert, js, log } from "cc";
import {  IUIConfig } from "./UIConfig";
import { FairyGUILayerManager, ILayerManager, UILayer } from "./LayerManager";
import {FairyGuiResMgr,IResManager  } from "./ResManager";


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





// UI管理器实现
export class UIManager  {
    /** 界面摄像机 */
    camera!: Camera;

    private uiInstances: Map<string, any>;
    private layerManager: ILayerManager
    private facade:IFacade 
    private UI_CONFIG:{ [uiId: string]: IUIConfig }
    private resManager:IResManager<fgui.GComponent>
    constructor(facade:IFacade) {
        this.uiInstances = new Map<string, any>();
        this.facade = facade
        this.layerManager = new FairyGUILayerManager()
        this.resManager = new FairyGuiResMgr()
    }


    public initialize(configs:{ [uiId: string]: IUIConfig }):UIManager{
        this.UI_CONFIG = configs 
        return this 
    }

    protected loadUI(config: IUIConfig): Promise<any> {
        return this.resManager.load(config)
    }

    public toast(message:string):void{
        console.log(message)
    }

    public async open(uiId: string, uiLayer: UILayer, ...params: any[]): Promise<string> {
        const config = this.UI_CONFIG[uiId];
        assert(!!config, `config is not exist,plz check uiId:${uiId}`);
        let uiInstance = this.uiInstances.get(uiId);
        if (!uiInstance) {
            try {
                const instanceId = this.genInstanceId(config);
                const loadedUIInstance = await this.loadUI(config);
                this.uiInstances.set(instanceId, loadedUIInstance);
                this.addUIToLayer(loadedUIInstance, uiLayer);
                let mediator = MediatorFactory.create(config.mediatorClass, instanceId, loadedUIInstance);
                this.facade.registerMediator(mediator);
                mediator.initialize(instanceId);
                mediator.open(...params);
                return instanceId;
            } catch (error) {
                // 处理加载或创建UI实例时出现的错误
                throw error;
            }
        } else {
            return uiId;
        }
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
        this.uiInstances.delete(instanceId)//从UI实例中移除
        mediator.dispose();
        this.facade.removeMediator(instanceId); //mediator移除
        this.layerManager.removeFromLayer(uiInstance, config.uiLayer) //层显示移除
        this.resManager.release(uiId,uiInstance) //资源管理释放
    }


    public get(instanceId: string): any | undefined {
        return this.uiInstances.get(instanceId);
    }


    private addUIToLayer(uiInstance: any, uiLayer: UILayer): void {
        this.layerManager.addToLayer(uiInstance, uiLayer)
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

}