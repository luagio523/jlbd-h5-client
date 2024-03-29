import { CircularQueue } from "../collection/CircularQueue";

export class ObjectPool<T> {

    public queue: CircularQueue<T>;
    private _stat: ObjectPoolReporter<T>;
    public name: string;

    constructor(
        public creator: () => T, 
        public destructor?: (object: T) => void, 
        public refresh?: (object: T) => void, 
        public repool?: (object: T) => void, 
        maxSize: number = 120) 
    {
        if (!creator) {
            throw new Error('ObjectPool needs a creator function.');
        }
        this._stat = new ObjectPoolReporter(this);
        this.queue = new CircularQueue<T>(maxSize); // Initialized with maxSize capacity
        for (let i = 0; i < maxSize; i++) {
            let newObject = this.creator();
            if (!newObject) {
                throw new Error('Creator function must return a non-null object.');
            }
            this.queue.enqueue(newObject); // Fill up object pool initially
        }
    }

    getObject(): T {
        let object: T | null = this.queue.dequeue();

        if (!object) {
            object = this.creator();
            this._stat.created();
        } else {
            this._stat.reused();
        }

        if (this.refresh && object) {
            this.refresh(object);
        }

        return object;
    }

    returnObject(object: T): boolean {
        if (!object) {
            throw new Error('Cannot return null or undefined object to the pool.');
        }

        if (!this.queue.isFull()) {
            if (this.repool) {
                this.repool(object);
            }
            this.queue.enqueue(object);
            this._stat.returned();
            return true 
        } else {
            if (this.destructor) {
                this.destructor(object);
            }
            this._stat.trimmed(); // If the pool is full, the object is destroyed
            return false 
        }
    }

    clear(): void {
        while (!this.queue.isEmpty()) {
            let obj = this.queue.dequeue();
            if (this.destructor && obj) {
                this.destructor(obj);
            }
        }
        this._stat.reset();
        this.queue.clear();
    }

    public get stat(): ObjectPoolReporter<T> {
        return this._stat;
    }
}

/**
 * 对象池 map组
 */
export class ObjectPoolMap<T> {
    private map: Map<string, ObjectPool<T>> = new Map<string, ObjectPool<T>>();

    constructor() {}
    
    setPool(id: string, pool: ObjectPool<T>): ObjectPool<T>  {
        if (!this.map.has(id)) {
            pool.name = id; // 假设 ObjectPool<T> 有一个 'name' 属性
            this.map.set(id, pool);
            return pool;
        }
    }

    hasPool(id: string): boolean {
        return this.map.has(id);
    }

    getPool(id: string): ObjectPool<T> | undefined {
        return this.map.get(id);
    }

    getPool_(id: string): ObjectPool<T> | null {
        return this.map.get(id) || null;
    }

    clearPool(id: string): void {
        const pool = this.map.get(id);
        if (pool) {
            pool.clear();
        }
    }

    clearAllPool(): void {
        this.map.forEach((pool) => {
            pool.clear();
        });
    }

    releasePool(id: string): void {
        const pool = this.map.get(id);
        if (pool) {
            pool.clear();
            this.map.delete(id);
        }
    }

    test(): void {
        let arr: Array<{ key: string; len: number }> = [];
        this.map.forEach((pool, key) => {
            if (!pool.queue.isEmpty()) { // 假设 ObjectPool<T> 有一个 'queue' 属性
                arr.push({ key: key, len: pool.queue.getSize() }); // 假设 'queue' 有一个 'getSize' 方法
            }
            console.log(">report>: \n", pool.stat.getReportStr()); // 假设 'stat' 有 'getReportStr' 方法
        });
        console.log(arr);
    }
}
/**
 * 对象池 状态报告
 */
export class ObjectPoolReporter<T> {

    private pool: ObjectPool<T>;
    private stat: ObjectPoolStat;

    constructor(pool: ObjectPool<T>) {
        this.pool = pool;
        this.stat = new ObjectPoolStat(this.pool.name);
    }
   

    reused() {
        this.stat.reused++;
    }
    returned() {
        this.stat.returned++;
    }

    trimmed(){
        this.stat.trimmed++;
    }

    created() {
        this.stat.created++;
    }

    reset() {
        this.stat.reset();
        return this;
    }

    getReport(): ObjectPoolStat {
        var ret: ObjectPoolStat = new ObjectPoolStat();
        if (this.pool.name) {
            ret.id = this.pool.name;
        }
        ret.created = this.stat.created;
        ret.returned = this.stat.returned;
        ret.reused = this.stat.reused;
        ret.trimmed = this.stat.trimmed;
        ret.inpool = this.pool.queue ? this.pool.queue.getSize() : 0;
        ret.wild = this.stat.created - this.pool.queue.getSize();
        return ret;
    }

    getReportStr(sep: string = '\n'): string {
        var ret: string[] = [];
        if (this.pool.name) {
            ret.push('name: ' + this.pool.name);
        }
        ret.push('created: ' + this.stat.created);
        ret.push('returned: ' + this.stat.returned);
        ret.push('reused: ' + this.stat.reused);
        ret.push('pool: ' + this.pool.queue.getSize());
        ret.push('trimmed: ' + this.stat.trimmed);
        ret.push('wild: ' + (this.stat.created - this.pool.queue.getSize() - this.stat.trimmed));
        return ret.join(sep);
    }
}

/**
 * 对象池 状态
 */
export class ObjectPoolStat {

    created = 0; //新建
    returned = 0;//返回到池中的
    reused = 0; //重用的
    inpool = 0; //在池中
    wild = 0; //野生的
    trimmed = 0; //丢弃的

    constructor(public id?: string) {

    }

    add(stat: ObjectPoolStat) {
        this.created += stat.created;
        this.reused += stat.reused;
        this.returned += stat.returned;
        this.trimmed += stat.trimmed;
        this.inpool += stat.inpool;
        this.wild += stat.wild;
        return this;
    }

    reset() {
        this.created = 0;
        this.reused = 0;
        this.returned = 0;
        this.trimmed = 0;
        this.inpool = 0;
        this.wild = 0;
        return this;
    }
}

