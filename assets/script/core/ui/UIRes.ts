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