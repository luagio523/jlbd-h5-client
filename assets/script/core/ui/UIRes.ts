import { GComponent } from "fairygui-cc";
import {  IUIConfig } from "./UIConfig";
import { assetManager, log, sys } from "cc";
import scheduler from "../../utils/scheduler";

export interface IResManager<T> {
    createUI(config: IUIConfig): Promise<T>;
    releaseUI(uiId: string, uiInstance: T): void;
}


export abstract class UIResBase<T> {
    protected config: IUIConfig
    protected uiId: string; //uiId配置标识
    protected instanceList: T[]
    protected maxIdleTime: number;
    protected idleAt: number;
    protected instanceRef:number = 0;
    public resourcePath:string

    public static DefaultUIIdleTime = 1 * 20 * 1000  // 默认 UI 释放时间 1 分钟

    constructor(config: IUIConfig) {
        this.config = config;
        this.uiId = config.uiId;
        this.resourcePath = config.resourcePath
        this.maxIdleTime = config.uiIdleTime ?? UIResBase.DefaultUIIdleTime;
        this.instanceList = [];
    }

    public async get(): Promise<T> {
        if(this.instanceList.length == 0){
            const instance = await this.createInstance(this.config);
            this.put(instance);
        }
        this.incrementRef(); 
        console.log(`UIResBase: get ui instance: ${this.uiId}, instanceRef: ${this.instanceRef}`);
        return this.instanceList.pop()
    }

    public put(instance: T): void {
        this.decrementRef();
        this.instanceList.push(instance);
        console.log(`UIResBase: put ui instance: ${this.uiId}, instanceRef: ${this.instanceRef}`);
    }


    private incrementRef(): void {
        this.instanceRef++;
        // this.idleAt =  Number.MAX_SAFE_INTEGER;
    }

    private decrementRef(): void {
        if (this.instanceRef > 0) {
            this.instanceRef--;
        }
        if(this.instanceRef <= 0){//如果引用计数为0，则说明没有任何地方引用了，可以进行回收
            this.idleAt = sys.now() ;
        }
    }
    // 由子类实现的具体清理assets的方法
    public abstract releaseAssets(resourcePath: string): void;
    // 由子类实现的具体清理UI实例的方法
    public abstract disposeUI(): void;

    protected abstract createInstance(config: IUIConfig): Promise<T>;

    public checkIdle(now: number): boolean {
        if(this.instanceRef > 0){
            return false;
        }
        if (now - this.idleAt > this.maxIdleTime) {
                this.disposeUI();
                log(`UIResBase: UI instance idle time out, release ui instance: ${this.uiId}`);
                return true;
        }
        return false;
    }

}




export abstract class AbstractResManager<T> implements IResManager<T> {
    protected resMap: Map<string, UIResBase<T>> = new Map<string, UIResBase<T>>();

    constructor() {
        scheduler.scheduleGlobal(this.cleanup.bind(this), 10); // 例如每30秒清理一次
    }

    protected existsUIResWithPath(resourcePath: string): boolean {
        for (let uiRes of this.resMap.values()) {
            if (uiRes.resourcePath === resourcePath) {
                return true;
            }
        }
        return false;
    }

    private cleanup() {
        const now = sys.now();
        for (const [uiId, uiRes] of this.resMap.entries()) {
            if (uiRes.checkIdle(now)) {
                uiRes.disposeUI(); // 释放UI实例资源
                this.resMap.delete(uiId);
                const resourcePath = uiRes.resourcePath;
                if (!this.existsUIResWithPath(resourcePath)) {
                    console.log(`释放资源resoucePath:${resourcePath}`);
                    uiRes.releaseAssets(resourcePath); // 释放assets资源
                }
            }
        }
        console.log(`cleanup当前资源总数:${assetManager.assets.count}`);
    }

    async createUI(config: IUIConfig): Promise<T> {
        if (!config.uiId || !config.resourcePath || !config.uiComponentName) {
            throw new Error("Invalid UI config provided.");
        }
        if (!this.resMap.has(config.uiId)) {
            this.resMap.set(config.uiId, this.createUIRes(config));
        }
        let res = this.resMap.get(config.uiId);
        if (res) {
            const component = await res.get();
            if (component) {
                return component;
            }
        }
    }

    getUIRes(uiId: string): UIResBase<T> | undefined {
        return this.resMap.get(uiId);
    }

    releaseUI(uiId: string, uiInstance: T): void {
        this.resMap.get(uiId)?.put(uiInstance);
    }

    protected abstract createUIRes(config: IUIConfig): UIResBase<T>;
}



