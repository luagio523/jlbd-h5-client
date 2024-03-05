import { ObjectPoolMap, ObjectPool } from "./ObjectPool";

/**
 * 一个对象池管理
 */
export default class PoolMgr extends ObjectPoolMap {
    private static inst:PoolMgr;

    static ins():PoolMgr
    {
        if(!this.inst)
        {
            this.inst = new PoolMgr();
            this.inst.init();
        }
        return this.inst;
    }

    private init():void{
        
    }

    /**
     * 注册一个对象池
     * @param id  对象池id 可以用类名标识 如:FlashObject  FlashObject_1 
     * @param creator  对象创建方法 返回一个对象
     * @param destructor  当对象池clear时  会调用 传入参数为 对象
     * @param refresh     当获取一个对象时 会调用 传入参数为 对象
     * @param repool      当放回对象池中时 会调用  传入参数为 对象
     */
    register(id:string,creator: Function, destructor?: (object: any) => void, refresh?: (object: any) => void, repool?: (object: any) => void):ObjectPool {
        return this.setPool(id,new ObjectPool(creator,destructor,refresh,repool))
    }
    
    /**
     * 清理某个对象池
     * @param id 
     */
    clear(id:string){

        this.releasePool(id)
        // let pool = this.getPool(id)
        // if(pool){
        //     pool.clear()
        // }else{
        //     cc.log("not found ObjectPool:%s",id)
        // }
    }

   

}