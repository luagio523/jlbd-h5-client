import { ICache } from "./Cache";

/**
 * 缓存配置接口
 */
interface CacheConfig {
    cache: ICache;
    interval: number;
}


/**
 * 缓存管理器类
 */
export class CacheManager  {

    private static instance: CacheManager;
    public static getInstance(): CacheManager {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }

    private caches: Map<string, CacheConfig>;

    constructor() {
        this.caches = new Map<string, CacheConfig>();
    }

    /**
     * 注册缓存
     * @param key 缓存键
     * @param cache 缓存实例
     * @param interval 自动保存间隔（毫秒）
     */
    public registerCache(key: string, cache: ICache, interval?: number): void {
        if (this.caches.has(key)) {
            console.warn(`缓存 ${key} 已存在`);
            return;
        }
        this.caches.set(key, { cache, interval });
        cache.start(interval);//注册即开始
    }

    /**
     * 获取缓存
     * @param key 缓存键
     * @returns 缓存实例或 null
     */
    public getCache(key: string): ICache | null {
        const config = this.caches.get(key);
        return config ? config.cache : null;
    }

    /**
     * 加载所有缓存
     */
    public loadAll(): void {
        this.caches.forEach(config => config.cache.load());
    }

    /**
     * 保存所有缓存
     * @param flush 是否立即刷新到存储
     */
    public saveAll(flush: boolean): void {
        this.caches.forEach(config => config.cache.save(flush));
    }

    /**
     * 开始所有缓存的自动保存
     */
    public startAll(): void {
        this.caches.forEach(config => config.cache.start(config.interval));
    }

    /**
     * 停止所有缓存的自动保存
     */
    public stopAll(): void {
        this.caches.forEach(config => config.cache.stop());
    }
}

// // 使用示例
// const cacheManager = new CacheManager();

// // 注册缓存实例，设置不同的自动保存间隔
// const roleCache = new RoleCache();
// const inventoryCache = new InventoryCache();

// cacheManager.registerCache('role', roleCache, 60000); // 角色数据每分钟保存一次
// cacheManager.registerCache('inventory', inventoryCache, 300000); // 物品栏数据每5分钟保存一次

// // 加载所有缓存
// cacheManager.loadAll();

// // 开始所有缓存的自动保存，使用注册时设置的间隔
// cacheManager.startAll();

// // 停止所有缓存的自动保存
// cacheManager.stopAll();

// // 保存所有缓存并立即刷新到存储
// cacheManager.saveAll(true);

