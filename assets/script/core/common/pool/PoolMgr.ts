import { ObjectPoolMap, ObjectPool } from "./ObjectPool";

export default class PoolMgr extends ObjectPoolMap<any> {
    private static inst: PoolMgr = new PoolMgr();

    private static instance: PoolMgr;

    public static getInstance(): PoolMgr {
        if (!PoolMgr.instance) {
            PoolMgr.instance = new PoolMgr();
        }
        return PoolMgr.instance;
    }
    

    // 注册方法现在使用泛型参数
    register<T>(id: string, creator: () => T, destructor?: (object: T) => void, refresh?: (object: T) => void, repool?: (object: T) => void): ObjectPool<T> {
        const newPool = new ObjectPool<T>(creator, destructor, refresh, repool);
        return this.setPool(id, newPool);
    }

    // 清理某个对象池的方法不需要被更改，它仍然适用
    clear(id: string): void {
        this.releasePool(id);
    }
}