import {  Node, Prefab, assetManager, instantiate, resources } from "cc";
import {  IUIConfig,  } from "./UIConfig";
import { sys } from "cc";
import scheduler from "../../utils/scheduler";

export interface IResManager<T> {
    load(config: IUIConfig): Promise<T>;
    release(uiId: string, uiInstance: T): void;
}


export abstract class UIResBase<T> {
    protected config: IUIConfig
    protected uiId: string; //uiId配置标识
    protected instanceList: T[]
    protected maxIdleTime: number;
    protected idleAt: number;
    protected ref:number = 0;

    public static DefaultUIIdleTime = 1 * 60 * 1000  // 默认 UI 释放时间 1 分钟

    constructor(config: IUIConfig) {
        this.config = config;
        this.maxIdleTime = config.uiIdleTime ?? UIResBase.DefaultUIIdleTime;
        this.instanceList = [];
    }

    public async get(): Promise<T> {
        if(this.instanceList.length == 0){
            const instance = await this.createInstance(this.config);
            this.put(instance);
        }
        this.ref ++;    
        return this.instanceList.pop()
    }

    public put(instance: T): void {
        this.ref --;
        this.instanceList.push(instance);

        if(this.ref <= 0){//如果引用计数为0，则说明没有任何地方引用了，可以进行回收
            this.idleAt = sys.now() ;
        }
    }
   
    // 由子类实现的具体清理UI实例的方法
    protected abstract release(config: IUIConfig): void;

    protected abstract createInstance(config: IUIConfig): Promise<T>;

    public checkIdle(now: number): boolean {
        if (now - this.idleAt > this.maxIdleTime) {
            if (this.ref <= 0) {
                this.release(this.config);
            }
            return true;
        }
        return false;
    }
}