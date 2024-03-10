import { Node, Prefab, assetManager, instantiate, resources } from "cc";
import { DefaultAssetsIdleTime, DefaultUIIdleTime, IUIConfig, ResourceType } from "./config";
import { sys } from "cc";

// 针对不同类型的资源定义不同的加载方法
const loadFairyGuiComponent = (config: IUIConfig): Promise<fgui.GComponent> => {
    return new Promise((resolve, reject) => {
        fgui.UIPackage.loadPackage(config.resourcePath, (error, uiPackage) => {
            if (error) {
                // 如果加载过程中出现错误，拒绝这个Promise
                reject(error);
            } else {
                // 加载成功, 根据UI配置创建组件
                try {
                    
                    const component = fgui.UIPackage.createObject(uiPackage.name, config.uiComponentName);
                    if (component instanceof fgui.GComponent) {
                        // 如果创建的是GComponent, 解析这个Promise
                        resolve(component);
                    } else {
                        // 如果创建了一个意外的对象类型, 拒绝这个Promise
                        reject(new Error("UI component created is not a GComponent"));
                    }
                } catch (creationError) {
                    // 如果创建组件过程中有任何错误，拒绝这个Promise
                    reject(creationError);
                }
            }
        });
    });
};



// 加载预制件的函数
const loadCocosPrefab = (config: IUIConfig): Promise<Node> => {
    return new Promise((resolve, reject) => {
        // 使用 assetManager 加载 Prefab
        assetManager.loadBundle('bundleName', (err, bundle) => {
            if (err) {
                reject(err); // 如果无法加载资源包，拒绝 Promise
                return;
            }
            // 在资源包中加载 Prefab
            bundle.load(config.resourcePath, Prefab, (error, loadedPrefab: Prefab) => {
                if (error) {
                    // 如果加载过程中出现错误，则拒绝这个Promise
                    reject(error);
                } else {
                    // 加载成功，创建一个Prefab的实例
                    const prefabInstance = instantiate(loadedPrefab);
                    // 如果创建的是 Node，解析这个 Promise
                    resolve(prefabInstance);
                }
            });
        });
    });
};




// 一个通用的资源加载策略
export function loaderUI(config: IUIConfig): Promise<Node | fgui.GComponent> {
    const resourceType = config.resourceType ?? ResourceType.FairyGuiComponent; // 使用默认值
    switch (resourceType) {
        case ResourceType.CocosCreatorPrefab:
            return loadCocosPrefab(config);
        case ResourceType.FairyGuiComponent:
        default: // 默认情况下处理为 FairyGuiComponent
            return loadFairyGuiComponent(config);
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
