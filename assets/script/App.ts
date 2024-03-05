

/**
 * 定义简洁的游戏中心
 * 方便程序调用
 */

import { oops } from "./core/Oops"
import { MessageManager } from "./core/common/event/MessageManager"
import NativeHelper from "./core/common/sdk/NativeHelper"
import PoolMgr from "./core/common/pool/PoolMgr"
import TextFilter from "./core/common/shield/TextFilter"
import { StorageManager } from "./core/common/storage/StorageManager"
import FrameMgr from "./core/common/timer/FrameMgr"
import { ITimerMgr, LinkListTimerMgr } from "./core/common/timer/TimerMgr"
import { IFacade } from "./core/mvc/interfaces/IFacade"
import { Facade } from "./core/mvc/patterns/facade/Facade"

// const i18n = require("LanguageData");

export default class app extends oops{
    public static WRITABLE_PATH:string

     /**
     * 是否显示新手引导
     */
    public static hasShowNewGuide:boolean

    
    public static get facade():IFacade{
        return Facade.getInstance("JLBD")
    }

    

    /**
     * 获取对象池管理
     */
    public static get poolMgr():PoolMgr{
        return PoolMgr.ins()
    }

    /**
     * 获取定时器
     */
    public static get timerMgr():ITimerMgr{
        return LinkListTimerMgr.ins()
    }

   
    

    /**
     * 帧类型交互管理
     */
    public static get FrameMgr():FrameMgr{
        return FrameMgr.ins()
    }
   
    

     /**
     * 获取屏蔽词过滤器
     */
    public static get textFilter():TextFilter{
        return TextFilter.ins()
    }

    /**
     * sdk
     */
    public static get nativeHelper():NativeHelper{
        return NativeHelper.ins()
    }

  

     /**
     * 获取cdn status
     */
    public static get cdnStatus():any{
        return true
    }

    /**
     * 退出游戏
     */
    public static exitGame():void{
       
    }

     /**
     * 尝试释放资源
     */
    public static tryDipose():void{
        // display.removeUnusedTextures()
        // cc.loader.release
    }



 
}


