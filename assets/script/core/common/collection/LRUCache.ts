export interface IAssetExpire {
    onExpire(): void;
}

export class LRUCache<K, T extends IAssetExpire> {
    private readonly capacity: number;
    private cache: Map<K, T>;
    private readonly accessOrder: Map<K, number>;
    private accessCounter: number = 0;

    constructor(capacity: number) {
        if (!Number.isInteger(capacity) || capacity <= 0) {
            throw new Error("Cache capacity must be a positive integer");
        }
        this.capacity = capacity;
        this.cache = new Map<K, T>();
        this.accessOrder = new Map<K, number>();
    }

    public get(key: K): T | undefined {
        const value = this.cache.get(key);
        if (value !== undefined) {
            this.updateAccessOrder(key);
        }
        return value;
    }

    public access(key: K): boolean {
        if (this.cache.has(key)) {
            this.updateAccessOrder(key);
            return true;
        }
        return false;
    }

    public set(key: K, value: T): void {
        if (value === undefined || value === null) {
            throw new Error("Cannot set undefined or null as a value");
        }
        
        if (this.cache.size >= this.capacity && !this.cache.has(key)) {
            this.evictLeastRecentlyUsed();
        }
        this.cache.set(key, value);
        this.updateAccessOrder(key);
    }

    public delete(key: K): boolean {
        const value = this.cache.get(key);
        if (value !== undefined) {
            value.onExpire();
            this.cache.delete(key);
            this.accessOrder.delete(key);
            return true;
        }
        return false;
    }

    public has(key: K): boolean {
        return this.cache.has(key);
    }

    public clear(): void {
        for (const value of this.cache.values()) {
            value.onExpire();
        }
        this.cache.clear();
        this.accessOrder.clear();
        this.accessCounter = 0;
    }

    public size(): number {
        return this.cache.size;
    }

    public *entries(): IterableIterator<[K, T]> {
        for (const [key, value] of this.cache.entries()) {
            yield [key, value];
        }
    }

    private updateAccessOrder(key: K): void {
        if (this.accessCounter === Number.MAX_SAFE_INTEGER) {
            this.rebuildAccessOrder();
        } else {
            this.accessOrder.set(key, ++this.accessCounter);
        }
    }

    private evictLeastRecentlyUsed(): void {
        let leastRecentlyUsedKey: K | undefined;
        let lowestCounter = Infinity;

        for (const [key, counter] of this.accessOrder) {
            if (counter < lowestCounter) {
                lowestCounter = counter;
                leastRecentlyUsedKey = key;
            }
        }

        if (leastRecentlyUsedKey !== undefined) {
            this.delete(leastRecentlyUsedKey);
        }
    }

    private rebuildAccessOrder(): void {
        const entries = Array.from(this.accessOrder.entries());
        entries.sort((a, b) => a[1] - b[1]);
        this.accessOrder.clear();
        this.accessCounter = 0;
        for (const [key] of entries) {
            this.accessOrder.set(key, ++this.accessCounter);
        }
    }
}
