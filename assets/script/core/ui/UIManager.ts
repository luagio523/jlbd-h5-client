import { Camera, Node, Rect, assert, js, log } from "cc";
import {  IUIConfig } from "./UIConfig";
import { ILayerManager, UILayer } from "./UILayer";
import {IResManager  } from "./UIRes";
import { GComponent } from "fairygui-cc";
import { FairyGUIManager, FairyGuiResManager } from "./FairyGUIManager";
import { ToastManager } from "./ToastManager";
import { AlertManager, AlertOptions } from "./AlertManager";
import { AdaptionManager,UIPosition } from "../common/Adaption/AdaptionManager"

// 
export interface IViewMediator {
   initialize(instance:GComponent|Node):void ;
   onOpen(params: any):void ; 
   onClose():void ; 
   onDestroy():void ; 
 }


interface IFacade {
    registerMediator(mediator: string): any;
    retrieveMediator(instanceId: string): any;
    removeMediator(instanceId:string):void 
}

export class UIManager {
    /** UI camera */
    public camera!: Camera;
    private mediatorMap: Map<string, any>; //uiId -> mediator 同时只有一个实例
    private uiInstances: Map<string, any>; // uiId -> uiInstance 同时只有一个实例
    private layerManager!: ILayerManager;
    private facade: IFacade;
    private UI_CONFIG!: { [uiId: string]: IUIConfig };
    private resManager!: IResManager<GComponent>;
    private toastManager!: ToastManager;
    private alertManager!: AlertManager;
    private adaptionManager!: AdaptionManager;

    constructor(facade: IFacade) {
        this.uiInstances = new Map<string, any>();
        this.mediatorMap = new Map<string, any>();
        this.facade = facade;
        this.adaptionManager.on("adaption-updated", (safeArea) => { // 屏幕适配更新事件
            this.adaptForUI(safeArea);
        })
    }

    public initialize(
        configs: { [uiId: string]: IUIConfig },
    ): UIManager {
        this.UI_CONFIG = configs;
        this.layerManager = new FairyGUIManager();
        this.resManager = new FairyGuiResManager();
        this.toastManager = ToastManager.getInstance();
        this.alertManager = AlertManager.getInstance();
        this.toastManager.initialize( this.layerManager);
        this.alertManager.initialize(this.layerManager);
        return this;
    }

  
    
    public alert(options: AlertOptions): void {
        this.alertManager!.showDialog(options);
    }

    public toast(message: string, duration: number = 2000): void {
        this.toastManager!.showToast(message, duration);
    }

    public async open(uiId: string, params?: any): Promise<void> {
        const config = this.UI_CONFIG[uiId];
        assert(!!config, `Config not found for uiId: ${uiId}`);

        let mediator = this.mediatorMap.get(uiId);
        let uiInstance = this.uiInstances.get(uiId);

        if(mediator && uiInstance){
            if(this.layerManager.isUIInLayer(uiInstance, config.uiLayer)){
                log(`UI instance is already in layer: ${uiId}`);
                return ;
            }
            this.addUIToLayer(uiInstance, config.uiLayer);
            mediator.onOpen(params);
            return ;
        }

        try {
            uiInstance = await this.createUI(config);
            this.uiInstances.set(uiId, uiInstance);

            mediator = this.facade.registerMediator(config.mediatorClass) as IViewMediator;
            this.mediatorMap.set(uiId, mediator);

            this.addUIToLayer(uiInstance, config.uiLayer);
            mediator.initialize(uiInstance);
            mediator.onOpen(params);
        } catch (error) {
            log(`Failed to open UI: ${uiId}`, error);
            throw error;
        }
        return ;
    }

   

    public close(uiId: string,destroy:boolean = true): void {
        const config = this.UI_CONFIG[uiId];
        let mediator = this.mediatorMap.get(uiId);
        let uiInstance = this.uiInstances.get(uiId);

        if (!config || !uiInstance || !mediator) {
            log(`Close failed. Please check  uiId: ${uiId}`);
            return;
        }
        this.layerManager.removeFromLayer(uiInstance, config.uiLayer);
        mediator.onClose();
        if(destroy){
            this.destroy(uiId); 
        }
    }

    private destroy(uiId: string): void {
        const config = this.UI_CONFIG[uiId];

        let mediator = this.mediatorMap.get(uiId);
        let uiInstance = this.uiInstances.get(uiId);

        if (!config || !uiInstance || !mediator) {
            log(`Destroy failed. Please check  uiId: ${uiId}`);
            return;
        }
        this.facade.removeMediator(config.mediatorClass);
        this.mediatorMap.delete(uiId);
        mediator.onDestroy();
        
        this.uiInstances.delete(uiId);
        this.resManager.release(uiId, uiInstance);
    }   

    public get(uiId: string): any | undefined {
        return this.uiInstances.get(uiId);
    }

    public isOpen(uiId: string): boolean {
        const config = this.UI_CONFIG[uiId];
        if (!config) {
            return false;
        }
        const uiInstance = this.uiInstances.get(uiId);
        if (!uiInstance) {
            return false;
        }
        return this.layerManager.isUIInLayer(uiInstance, config.uiLayer);
    }

    public closeAll(): void {
        this.uiInstances.forEach((_, instanceId) => this.close(instanceId));
    }

    private addUIToLayer(uiInstance: any, uiLayer: UILayer): void {
        assert(!!this.layerManager, "Layer manager is not initialized");
        this.layerManager.addToLayer(uiInstance, uiLayer);
    }

    private async createUI(config: IUIConfig): Promise<any> {
        assert(!!this.resManager, "Resource manager is not initialized");
        return  this.resManager.create(config);
    }


    /**
     * 适配UI
     * @param safeArea 
     */
    private adaptForUI(safeArea:Rect): void {
        this.uiInstances.forEach((uiInstance, uiId) => {
            const config = this.UI_CONFIG[uiId];
            if (config && (config.uiLayer === UILayer.BACKGROUND || config.uiLayer === UILayer.MAIN)) {
                if (uiInstance instanceof GComponent) {
                    uiInstance.makeFullScreen();
                } else if (uiInstance instanceof Node) {
                    this.adaptionManager.adaptNode(uiInstance, UIPosition.Center,safeArea);
                }
            }
        });
    }
}
