import { Node, Prefab, assetManager, instantiate, resources } from "cc";
import { DefaultAssetsIdleTime, DefaultUIIdleTime, IUIConfig, ResourceType } from "./config";
import { sys } from "cc";

// IUserInterfaceLoader接口
export interface IUILoader {
    load(config: IUIConfig): Promise<any>;
}

// FairyGuiComponentLoader 类，实现了 IUserInterfaceLoader
export class FairyGuiLoader implements IUILoader {
    load(config: IUIConfig): Promise<fgui.GComponent> {
        return new Promise((resolve, reject) => {
            fgui.UIPackage.loadPackage(config.resourcePath, (error, uiPackage) => {
                if (error) {
                    reject(error);
                } else {
                    try {
                        const component = fgui.UIPackage.createObject(uiPackage.name, config.uiComponentName);
                        if (component instanceof fgui.GComponent) {
                            resolve(component);
                        } else {
                            reject(new Error("UI component created is not a GComponent"));
                        }
                    } catch (creationError) {
                        reject(creationError);
                    }
                }
            });
        });
    }
}

// CocosPrefabLoader 类，也实现了 IUserInterfaceLoader
export class CocosPrefabLoader implements IUILoader {
    load(config: IUIConfig): Promise<Node> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle('bundleName', (err, bundle) => {
                if (err) {
                    reject(err);
                    return;
                }
                bundle.load(config.resourcePath, Prefab, (error, loadedPrefab: Prefab) => {
                    if (error) {
                        reject(error);
                    } else {
                        const prefabInstance = instantiate(loadedPrefab);
                        resolve(prefabInstance);
                    }
                });
            });
        });
    }
}



export interface IReleaseRes {
    clean(now:number):boolean 
    getAccessTime():number
    access():void 
    getKey():string 
}

export class FairyGuiUIRelease implements IReleaseRes {
    private uiInstance:fgui.GComponent
    private instanceId:string
    public lastAccessed:number
    private maxIdle:number 

    public constructor(uiInstance:fgui.GComponent,instanceId:string,maxIdle:number){
        this.uiInstance = uiInstance
        this.instanceId = instanceId
        this.maxIdle = maxIdle
        this.lastAccessed = sys.now()
    }
    public clean(now:number):boolean{
        if(now - this.lastAccessed < this.maxIdle){
            return false
        }
        if(this.uiInstance){
            this.uiInstance.dispose() 
        }
        return true 
    }
 
    public getAccessTime():number{
        return this.lastAccessed
    }
    public getKey(): string {
        return this.instanceId
    }
    public access():void{
        this.lastAccessed = sys.now()
    }
}

export class FairyGuiPackageRelease implements IReleaseRes {
    private resourcePath:string
    public lastAccessed:number
    private maxIdle:number 
    public constructor(resourcePath:string,maxIdle:number){
        this.resourcePath = resourcePath
        this.maxIdle = maxIdle
        this.lastAccessed = sys.now()
    }
    public clean(now:number):boolean{
        if(now - this.lastAccessed < this.maxIdle){
            return false 
        }
        fgui.UIPackage.removePackage(this.resourcePath)
        return true 
    }
    public getAccessTime():number{
        return this.lastAccessed
    }
    public getKey(): string {
        return this.resourcePath
    }
    public access():void{
        this.lastAccessed = sys.now()
    }
}


export class CocosCreatorUIRelease implements IReleaseRes {
    private uiInstance:Node
    private instanceId:string
    private maxIdle:number
    public lastAccessed:number

    public constructor(uiInstance:Node ,instanceId:string,maxIdle:number ){
        this.uiInstance = uiInstance
        this.instanceId = instanceId
        this.maxIdle = maxIdle
        this.lastAccessed = sys.now()
    }

    public clean(now:number):boolean{
        if(now - this.lastAccessed < this.maxIdle){
            return false
        }
        if(this.uiInstance){
            this.uiInstance.destroy() 
        }
        return true 
    }

    public getAccessTime():number{
        return this.lastAccessed
    }

    public access():void{
        this.lastAccessed = sys.now()
    }

    public getKey(): string {
        return this.instanceId
    }
}

export class CocosCreatorAssetsRelease implements IReleaseRes {
    private resourcePath:string
    public lastAccessed:number
    private maxIdle:number

    public constructor(resourcePath:string,maxIdle:number ){
        this.resourcePath = resourcePath
        this.maxIdle = maxIdle
        this.lastAccessed = sys.now()
    }

    public clean(now:number):boolean{
        if(now - this.lastAccessed < this.maxIdle){
            return false
        }
        resources.release(this.resourcePath,Prefab)
        return true 
    }

    public getAccessTime():number{
        return this.lastAccessed
    }

    public access():void{
        this.lastAccessed = sys.now()
    }

    public getKey(): string {
        return this.resourcePath
    }
}
