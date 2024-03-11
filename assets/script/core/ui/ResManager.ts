import {  Node, Prefab, assetManager, instantiate, resources } from "cc";
import {  IUIConfig,  } from "./UIConfig";
import { sys } from "cc";
import scheduler from "../../utils/scheduler";

export interface IResManager<T> {
    load(config: IUIConfig): Promise<T>;
    release(uiId: string, uiInstance: T): void;
}


export class FairyGuiResMgr implements IResManager<fgui.GComponent> {
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

    async load(config: IUIConfig): Promise<fgui.GComponent> {
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
            const component = fgui.UIPackage.createObject(uiPackage.name, config.uiComponentName);
            
            if (component instanceof fgui.GComponent) {
                return component;
            } else {
                throw new Error("UI component created is not a GComponent");
            }

        } catch (error) {
            throw error;
        }
    }


    private loadPackage(resourcePath: string): Promise<fgui.UIPackage> {
        return new Promise((resolve, reject) => {
            fgui.UIPackage.loadPackage(resourcePath, (error, uiPackage) => {
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

    release(uiId:string,uiInstance:fgui.GComponent):void{
        this.getUIRes(uiId)?.put(uiInstance)
    }
}



export class CocosCreatorResMgr  implements IResManager<Node> {
    private resMap:{ [uiId: string]: CocosCreateUIRes }

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

    async load(config: IUIConfig): Promise<Node> {
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
                res = new CocosCreateUIRes(config);
                this.resMap[config.uiId] = res;
            }

            const loadedPrefab = await this.loadPrefab(config.resourcePath);
            const prefabInstance = instantiate(loadedPrefab);

            if (prefabInstance instanceof Node) {
                return prefabInstance;
            } else {
                throw new Error("UI component created is not a Node");
            }

        } catch (error) {
            throw error;
        }
    }

    loadPrefab(resourcePath: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle('bundleName', (err, bundle) => {
                if (err) {
                    reject(err);
                    return;
                }
                bundle.load(resourcePath, Prefab, (error, loadedPrefab: Prefab) => {
                    if (error) {
                        reject(error);
                    } else {
                       
                        resolve(loadedPrefab);
                    }
                });
            });
        });
    } 
   
    getUIRes(uiId:string ):CocosCreateUIRes{
        return  this.resMap[uiId]
    }

    release(uiId:string,uiInstance:Node):void{
        this.getUIRes(uiId)?.put(uiInstance)
    }
}

abstract class UIResBase<T> {
    protected config: IUIConfig
    protected uiId: string; //uiId配置标识
    protected instanceList: T[]
    protected idleTime: number;
    protected lastAccessed: number;

    public static DefaultUIIdleTime = 1 * 60 * 1000  // 默认 UI 释放时间 1 分钟

    constructor(config: IUIConfig) {
        this.config = config;
        this.idleTime = config.uiIdleTime ?? UIResBase.DefaultUIIdleTime;
        this.instanceList = [];
    }

    public get(): T | undefined {
        return this.instanceList.pop()
    }

    public put(instance: T): void {
        this.instanceList.push(instance);
    }
   
    // 由子类实现的具体清理UI实例的方法
    protected abstract cleanUI(): void;

    // 由子类实现的具体清理资源的方法
    protected abstract cleanAssets(resourcePath: string): void;

    public clean(now: number): boolean {
        const waitTime = now - this.lastAccessed;
        if (waitTime < this.idleTime) {
            return false;
        }

        if (this.instanceList.length > 0) {
            this.cleanUI();
        }

        if (waitTime > this.idleTime * 2) {
            this.cleanAssets(this.config.resourcePath);
            return true;
        }

        return false;
    }
}

class FairyGuiUIRes extends UIResBase<fgui.GComponent> {
    protected cleanUI() {
        this.instanceList.forEach((instance: fgui.GComponent) => {
            instance.dispose();
        });
        this.instanceList = [];
    }

    protected cleanAssets(resourcePath: string) {
        fgui.UIPackage.removePackage(resourcePath);
    }
}

class CocosCreateUIRes extends UIResBase<Node> {
    protected cleanUI() {
        this.instanceList.forEach((instance: Node) => {
            instance.destroy();
        });
        this.instanceList = [];
    }

    protected cleanAssets(resourcePath: string) {
        resources.release(resourcePath, Prefab)
    }
}



