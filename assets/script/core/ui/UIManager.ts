import { Camera, Node, assert, js, log } from "cc";
import {  IUIConfig } from "./UIConfig";
import { ILayerManager, UILayer } from "./UILayer";
import {IResManager  } from "./UIRes";
import { GComponent } from "fairygui-cc";
import { FairyGUIManager, FairyGuiResManager } from "./FairyGUIManager";
import { ToastManager } from "./ToastManager";
import { AlertManager, AlertOptions } from "./AlertManager";


// 
export interface IViewMediator {
   initialize(instance:GComponent|Node): Promise<void>;
   open(params: any): Promise<void>; 
   close(): Promise<void>; 
 }




interface IFacade {
    registerMediator(mediator: string): any;
    retrieveMediator(instanceId: string): any;
    removeMediator(instanceId:string):void 
}



export class UIManager {
    /** UI camera */
    public camera!: Camera;

    private uiInstances: Map<string, any>; // uiId -> uiInstance 同时只有一个实例
    private layerManager!: ILayerManager;
    private facade: IFacade;
    private UI_CONFIG!: { [uiId: string]: IUIConfig };
    private resManager!: IResManager<GComponent>;

    constructor(facade: IFacade) {
        this.uiInstances = new Map<string, any>();
        this.facade = facade;
    }

    public initialize(
        configs: { [uiId: string]: IUIConfig },
    ): UIManager {
        this.UI_CONFIG = configs;
        this.layerManager = new FairyGUIManager();
        this.resManager = new FairyGuiResManager();
        
        ToastManager.getInstance().initialize( this.layerManager);
        AlertManager.getInstance().initialize(this.layerManager);
        return this;
    }

    protected async loadUI(config: IUIConfig): Promise<any> {
        assert(!!this.resManager, "Resource manager is not initialized");
        try {
            return await this.resManager.load(config);
        } catch (error) {
            log(`Failed to load UI: ${config.uiId}`, error);
            throw error;
        }
    }

    
    public alert(options: AlertOptions): void {
        AlertManager.getInstance().showDialog(options);
    }

    public toast(message: string, duration: number = 2000): void {
        ToastManager.getInstance().showToast(message, duration);
    }

    public async open(uiId: string, params?: any): Promise<void> {
        const config = this.UI_CONFIG[uiId];
        assert(!!config, `Config not found for uiId: ${uiId}`);

        let uiInstance = this.uiInstances.get(uiId);

        if (!uiInstance) {
            try {
                uiInstance = await this.loadUI(config);
                this.uiInstances.set(uiId, uiInstance);
                this.addUIToLayer(uiInstance, config.uiLayer);
                const mediator = this.facade.registerMediator(config.mediatorClass);
                mediator.initialize(uiInstance).then(() => {
                    mediator.open(params);
                });

            } catch (error) {
                log(`Failed to open UI: ${uiId}`, error);
                throw error;
            }
        } else {
            log(`UI instance already exists: ${uiId}`);
        }

        return ;
    }

    public close(uiId: string): void {
        const uiInstance = this.uiInstances.get(uiId);
        const config = this.UI_CONFIG[uiId];
        const mediator = this.facade.retrieveMediator(config.mediatorClass);

        if (!config || !uiInstance || !mediator) {
            log(`Close failed. Please check  uiId: ${uiId}`);
            return;
        }

        this.uiInstances.delete(uiId);
        mediator.dispose();
        this.facade.removeMediator(config.mediatorClass);
        this.layerManager.removeFromLayer(uiInstance, config.uiLayer);
        this.resManager.release(uiId, uiInstance);
    }

    public get(uiId: string): any | undefined {
        return this.uiInstances.get(uiId);
    }

    public isOpen(uiId: string): boolean {
        return this.uiInstances.has(uiId);
    }

    public closeAll(): void {
        this.uiInstances.forEach((_, instanceId) => this.close(instanceId));
    }

    private addUIToLayer(uiInstance: any, uiLayer: UILayer): void {
        assert(!!this.layerManager, "Layer manager is not initialized");
        this.layerManager.addToLayer(uiInstance, uiLayer);
    }


    public adaptUI(): void {
        this.uiInstances.forEach((uiInstance, uiId) => {
            const config = this.UI_CONFIG[uiId];
            if (config && (config.uiLayer === UILayer.BACKGROUND || config.uiLayer === UILayer.MAIN)) {
                if (uiInstance instanceof GComponent) {
                    uiInstance.makeFullScreen();
                }
            }
        });
    }
}
