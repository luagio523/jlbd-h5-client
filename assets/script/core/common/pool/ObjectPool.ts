import { HighQueue } from "../utils/HighDicList";
import scheduler from "../utils/scheduler";


/**
 * 对象池
 */
export class ObjectPool {

    public objQueue:HighQueue;
    private _name: string;
    private _stat: ObjectPoolReporter;

    public set name(name:string){
        this._name = name;

        this.objQueue.name = name
    }

    public get name():string{
        return this._name
    }

    public static checkCount:number = 0
    
   
    private monitorTimer:number = -1;
   
    constructor(public creator: Function, public destructor?: (object: any) => void, public refresh?: (object: any) => void, public repool?: (object: any) => void) {
        if (!creator) {
            throw new Error('ObjectPool needs a creator function');
        }
        this._stat = new ObjectPoolReporter(this);

        this.objQueue = new HighQueue

        
    }

    /**
     * 设置初始化数目
     * 缓存命中率
     * @param num 
     */
    public setInitNum(num:number = 50){
        for (let index = 0; index < num; index++) {
           let obj = this.getObject()
           if(obj){
               this.returnObject(obj)
           }
        }
    }

    private startMonitor(){
        if(this.monitorTimer == -1){
            this.monitorTimer = scheduler.scheduleGlobal((dt)=>{

                ObjectPool.checkCount += 1

                this.checkDormancy()
            },30)
        }
    }

    public setCapacity(capacity:number){
        this.objQueue.setCapacity(capacity)
    }

    /**
     * 设置基本容积
     * @param limit 
     */
    public setLimit(limit:number){
    }

    getObject(): any {
        var object: any;
        if (!this.objQueue.isEmpty()) {
            object = this.objQueue.pop();

            if(!object){
                cc.error(this.objQueue)
            }
            if (this.refresh) {
                this.refresh(object);
            }
            this._stat.reused();
        }
        else {
            object = this.creator();
            if(!object){
                cc.error(" get object creator return null")
                return 
                // object._pool = this;
            }

            if (this.refresh) {
                this.refresh(object);
            }
            this._stat.created();
        }
        return object;
    }

    //检测休眠
    checkDormancy():void{
        if(this._stat.isDormancy()){ //长时间未创建则从对象池删除一个 保证利用率
            if (!this.objQueue.isEmpty() ) {

                let obj = this.objQueue.pop()
                if(obj){
                    obj._pool = null;
                    if(this.destructor) {
                        this.destructor(obj);
                    }
                    this._stat.trimmed(); //丢弃
                    // cc.log("objectpool dormancy trimmed:",this.name)
                }
            }
        }
    }

    returnObject(object: any): boolean {
        if (!object) {
            throw new Error('ObjectPool.returnObject null object');
        }

        // if (object._pool === this) {
           
            let succ = this.objQueue.push(object);
            if(!succ){
                if (this.destructor) {
                    this.destructor(object);
                }
                this._stat.trimmed(); //丢弃
                return true
            }


            if (this.repool) {
                this.repool(object);
            }
            this._stat.returned();

            this.startMonitor(); // 监测

            return true;
        // }

        return false
        // throw new Error('ObjectPool.returnObject object does not belong here');
    }

    clear() {

        if(this.monitorTimer != -1){
            scheduler.unscheduleGlobal(this.monitorTimer) //
            this.monitorTimer = -1
        }


        //cc.log(['ObjectPool.getObject clear', this.stat.getReport()]);
     
        let obj = null
        while(!this.objQueue.isEmpty()){
            obj = this.objQueue.pop()
            obj._pool = null;
            if (this.destructor) {
                this.destructor(obj);
            }
        }
       
        this.objQueue.clear();

        this._stat.reset();
    }

    public get stat():ObjectPoolReporter{
        return this._stat
    }
}

/**
 * 对象池 map组
 */
export class ObjectPoolMap {

    private map = new Map();

    constructor() {
    }

    setPool(id: string, pool: ObjectPool) {
        // cc.log(['ObjectPool.setPool', id]);
        if (this.map.has(id)) {
            return 
            throw new Error('ObjectPoolMap.setPool cannot redefine pool id "' + id + '"');
        }
        pool.name = id;
        this.map.set(id, pool);
        return pool;
    }

    hasPool(id: string): boolean {
        return this.map.has(id);
    }

    getPool(id: string): ObjectPool {
        if (!this.map.has(id)) {
            throw new Error('ObjectPoolMap.getPool unknown pool id "' + id + '"');
        }
        return this.map.get(id);
    }

    getPool_(id: string): ObjectPool {
        if (!this.map.has(id)) {
           return null
        }
        return this.map.get(id);
    }

    clearPool(id:string){
        if (!this.map.has(id)) {
            // throw new Error('ObjectPoolMap.releasePool pool id "' + id + '"');
            return
        }
        this.map.get(id).clear();
    }

    clearAllPool() {
        this.map.forEach((pool, key, array)=>{
            pool.clear();
        })

    }

    releasePool(id: string) {
        if (!this.map.has(id)) {
            // throw new Error('ObjectPoolMap.releasePool pool id "' + id + '"');
            return
        }
        this.map.get(id).clear();
        this.map.delete(id);
    }

    test() {
        let arr = [];
        this.map.forEach((pool:ObjectPool, key, array)=>{
            if(!pool.objQueue.isEmpty()) {
                arr.push({key:key, len:pool.objQueue.getObjSize()});
            }
            console.log(">report>: \n", pool.stat.getReportStr());
        })
    }
}
/**
 * 对象池 状态报告
 */
export class ObjectPoolReporter {

    private pool: ObjectPool;
    private stat: ObjectPoolStat;

    private lstCheckCount:number

    constructor(pool: ObjectPool) {
        this.lstCheckCount = 0;
        this.pool = pool;
        this.stat = new ObjectPoolStat(this.pool.name);
    }
    /**
     * 保证对象池的利用率，长时间未创建将做出处理
     */
    isDormancy(){
        return ObjectPool.checkCount - this.lstCheckCount >= 2 // 大于2次
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
        this.lstCheckCount = ObjectPool.checkCount 
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
        ret.inpool = this.pool.objQueue ? this.pool.objQueue.getObjSize() : 0;
        ret.wild = this.stat.created - this.pool.objQueue.getObjSize();
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
        ret.push('pool: ' + this.pool.objQueue.getObjSize());
        ret.push('trimmed: ' + this.stat.trimmed);
        ret.push('wild: ' + (this.stat.created - this.pool.objQueue.getObjSize() - this.stat.trimmed));
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

