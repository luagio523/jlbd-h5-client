import { Node, Vec3, js } from "cc"
import app from "../../App"


/**
 *   游戏对象
 *   (拥有一个返回对象池的方法)
 */
export default class GameObject extends Node {

    public constructor(){
        super()
    }

    //帧update
    public update(dt:number):void{
        
    }

    /**
     * 销毁
     * overide  destory
     */
    public destroy():boolean{
        super.destroy()
        this.onDestroy()
        return true
    }

    //当销毁时
    protected onDestroy():void{

    }

    public scale2D(x:number,y:number): void {
        this.setScale(new Vec3(x,y));
    }

    public scaleX(x:number):void{
        this.setScale(new Vec3(x, this.scale.y, this.scale.z)) ;
    }

    public scaleY(y:number):void{
        this.setScale(new Vec3(this.scale.y, y, this.scale.z)) ;
    }

    /**
     * 移除
     */
    public remove():void{
        this.onRemove()
        if(!this.parent){
            return
        }
        this.removeFromParent()
        if(!this.__return_pool__()){//在移除时归还池
            this.destroy() //归还失败时直接销毁  (没有注册对象池的野比对象)
        }  
    }

    /**
	 * 当在显示层中 移除时
	 */
    protected onRemove():void{
    }

    

    /**
     * 私有禁止被重写
     * 归还对象池
     */
    private __return_pool__():boolean{
        let pool = app.poolMgr.getPool_(js.getClassName(this)) //getPool_不会丢出异常
        if(pool){
            return pool.returnObject(this)
        }
        return false
    }

} 