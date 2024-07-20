import scheduler from "../../utils/scheduler";
import { StorageManager } from "../common/storage/StorageManager";

/**
 * 缓存接口
 */
export interface ICache {
    load(): void; // 加载数据
    save(flush: boolean): void; // 保存数据
    start(interval: number): void; // 开始自动保存
    stop(): void; // 停止自动保存
}

export enum CacheType {
    CLIENT = 0, // 只保存在客户端
    SERVER = 1, // 只保存在服务端
}

/**
 * 抽象缓存类
 */
export abstract class Cache implements ICache {
    protected type: CacheType;
    protected data: any;
    private flushTimer: number = null;

    constructor(type: CacheType = CacheType.CLIENT) {
        this.type = type;
        this.data = null;
    }

    /**
     * 恢复数据
     * @param data 要恢复的数据
     */
    protected abstract recover(data: any): void;

    /**
     * 获取数据
     */
    protected abstract getData(): any;

    /**
     * 获取缓存键
     */
    protected abstract getKey(): string;

    /**
     * 保存数据
     * @param flush 是否立即刷新到存储
     */
    public save(flush: boolean): void {
        switch (this.type) {
            case CacheType.CLIENT:
                this.saveToClient(flush);
                break;
            case CacheType.SERVER:
                this.saveToServer(flush);
                break;
        }
    }

    /**
     * 加载数据
     */
    public load(): void {
        let loadedData: any;
        switch (this.type) {
            case CacheType.CLIENT:
                loadedData = this.loadFromClient();
                break;
            case CacheType.SERVER:
                loadedData = this.loadFromServer();
                break;
        }
        if (loadedData !== null) {
            this.recover(loadedData);
        }
    }

    /**
     * 开始自动保存
     * @param interval 保存间隔（毫秒）
     */
    public start(interval: number=600000): void {
        if (this.flushTimer) {
            this.stop();
        }
        this.flushTimer = scheduler.scheduleGlobal(this.save.bind(this),interval)
    }

    /**
     * 停止自动保存
     */
    public stop(): void {
        if (this.flushTimer) {
            scheduler.unscheduleGlobal(this.flushTimer);
            this.flushTimer = null;
        }
    }

    /**
     * 从客户端加载数据
     */
    protected loadFromClient(): any {
        return StorageManager.getInstance().getItem(this.getKey());
    }

    /**
     * 从服务器加载数据
     */
    protected loadFromServer(): any {
        // TODO: 实现从服务器加载数据的逻辑
        return null;
    }

    /**
     * 保存到客户端
     */
    protected saveToClient(flush: boolean): void {
        StorageManager.getInstance().setItem(this.getKey(), this.data);
    }

    /**
     * 保存到服务器
     */
    protected saveToServer(flush: boolean): void {
        // TODO: 实现保存到服务器的逻辑
    }
}
