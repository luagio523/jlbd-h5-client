
export interface IAssetExpire {
    onExpire(): void;
}



export class LRUCache<K, T extends IAssetExpire> {
    private capacity: number;
    private cache: Map<K, T>;
    private accessOrder: Array<K>;
  
    constructor(capacity: number) {
		if (capacity <= 0) {
			throw new Error("Cache capacity must be greater than 0");
		}
		this.capacity = capacity;
		this.cache = new Map<K, T>();
		this.accessOrder = new Array<K>();
    }
  
    public get(key: K): T | undefined {
		const value = this.cache.get(key);
		if (value) {
			// 移到访问顺序的尾部
			this.updateAccessOrder(key);
			return value;
		}
		return undefined;
    }

    public access(key:K){
        // 移到访问顺序的尾部
        this.updateAccessOrder(key);
    }
  
    public set(key: K, value: T): void {
		if (this.cache.has(key)) {
			// 更新值并移动访问顺序
			this.cache.set(key, value);
			this.updateAccessOrder(key);
		} else {
			// 清理缓存的逻辑
			this.evictIfNeeded();
			this.cache.set(key, value);
			this.accessOrder.push(key);
		}
    }

    public has(key:K):boolean{
      	return this.cache.has(key)
    }
  
    private evictIfNeeded() {
        // 如果缓存已满，删除最早的条目
        if (this.cache.size >= this.capacity) {
          const keyToEvict = this.accessOrder.shift();
          if (keyToEvict !== undefined) {
            // entity变量应该在delete之前从cache中获取
            let entity = this.cache.get(keyToEvict);
            if (entity) {
              entity.onExpire()
            }
            this.cache.delete(keyToEvict);
          }
        }
    }
  
    private updateAccessOrder(key: K) {
		// 移除旧的访问记录并将其放置到最后一位
		const index = this.accessOrder.indexOf(key);
		if (index > -1) {
			this.accessOrder.splice(index, 1);
		}
		this.accessOrder.push(key);
    }
  
    // 您可能还想提供清除缓存的方法
    public clear() {
		this.cache.clear();
		this.accessOrder.length = 0;
    }
  
    // 可能需要实现其他助手方法，例如检查当前缓存大小
    public size(): number {
      	return this.cache.size;
    }
}