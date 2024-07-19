import { Camera, assert, js, log } from "cc";
import {  IUIConfig } from "./UIConfig";
import { ILayerManager, UILayer } from "./UILayer";
import {IResManager  } from "./UIRes";
import { GComponent } from "fairygui-cc";
import { FairyGUIManager, FairyGuiResManager } from "./FairyGUIManager";


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




export class UIManager {
    /** UI camera */
    public camera!: Camera;

    private uiInstances: Map<string, any>;
    private layerManager!: ILayerManager;
    private facade: IFacade;
    private UI_CONFIG!: { [uiId: string]: IUIConfig };
    private resManager!: IResManager<GComponent>;
    private instanceCounter: number = 0;

    constructor(facade: IFacade) {
        this.uiInstances = new Map<string, any>();
        this.facade = facade;
    }

    public initialize(
        configs: { [uiId: string]: IUIConfig },
        layerManager: ILayerManager,
        resManager: IResManager<GComponent>
    ): UIManager {
        this.UI_CONFIG = configs;
        this.layerManager = layerManager;
        this.resManager = resManager;
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

    public toast(message: string): void {
        console.log(`Toast: ${message}`);
        // Implement actual toast functionality here
    }

    public async open(uiId: string, ...params: any[]): Promise<string> {
        const config = this.UI_CONFIG[uiId];
        assert(!!config, `Config not found for uiId: ${uiId}`);

        const instanceId = this.genInstanceId(config);
        let uiInstance = this.uiInstances.get(instanceId);

        if (!uiInstance) {
            try {
                uiInstance = await this.loadUI(config);
                this.uiInstances.set(instanceId, uiInstance);
                this.addUIToLayer(uiInstance, config.uiLayer);

                const mediator = MediatorFactory.create(config.mediatorClass, instanceId, uiInstance);
                this.facade.registerMediator(mediator);
                await mediator.initialize(instanceId);
                await mediator.open(...params);
            } catch (error) {
                log(`Failed to open UI: ${uiId}`, error);
                throw error;
            }
        } else {
            log(`UI instance already exists: ${instanceId}`);
        }

        return instanceId;
    }

    public close(instanceId: string): void {
        const uiId = this.getUiIdFromInstanceId(instanceId);
        const uiInstance = this.uiInstances.get(instanceId);
        const mediator = this.facade.retrieveMediator(instanceId);
        const config = this.UI_CONFIG[uiId];

        if (!config || !uiInstance || !mediator) {
            log(`Close failed. Please check instanceId: ${instanceId}, uiId: ${uiId}`);
            return;
        }

        this.uiInstances.delete(instanceId);
        mediator.dispose();
        this.facade.removeMediator(instanceId);
        this.layerManager.removeFromLayer(uiInstance, config.uiLayer);
        this.resManager.release(uiId, uiInstance);
    }

    public get(instanceId: string): any | undefined {
        return this.uiInstances.get(instanceId);
    }

    public isOpen(uiId: string): boolean {
        return Array.from(this.uiInstances.keys()).some(instanceId => this.getUiIdFromInstanceId(instanceId) === uiId);
    }

    public closeAll(): void {
        this.uiInstances.forEach((_, instanceId) => this.close(instanceId));
    }

    private addUIToLayer(uiInstance: any, uiLayer: UILayer): void {
        assert(!!this.layerManager, "Layer manager is not initialized");
        this.layerManager.addToLayer(uiInstance, uiLayer);
    }

    private genInstanceId(config: IUIConfig): string {
        const repeat = config.uiRepeat ?? false;
        this.instanceCounter += 1;
        return repeat ? `${config.uiId}_${this.instanceCounter}` : config.uiId;
    }

    private getUiIdFromInstanceId(instanceId: string): string {
        return instanceId.split('_')[0];
    }
}
