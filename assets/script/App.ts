

/**
 * 定义简洁的游戏中心
 * 方便程序调用
 */

import { oops } from "./core/Oops"
import NativeHelper from "./core/common/sdk/NativeHelper"
import PoolMgr from "./core/common/pool/PoolMgr"
import TextFilter from "./core/common/shield/TextFilter"
import { HeapTimerMgr, ITimerMgr, LinkListTimerMgr } from "./core/common/timer/TimerMgr"
import { GameTimer } from "./core/common/timer/GameTimer"
import ConfigMgr from "./manager/ConfigMgr"


// const i18n = require("LanguageData");

export default class app extends oops{
    public static WRITABLE_PATH:string

    
    
    

    /**
     * 获取对象池管理
     */
    public static get poolMgr():PoolMgr{
        return PoolMgr.ins()
    }

     /**
     * 获取定时器
     */
    public static timerMgr:ITimerMgr = new HeapTimerMgr()
    
    /**
     * 游戏时间
     */
    public static gameTimer:GameTimer = new GameTimer()

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
     * 获取配置
     */
    public static get config():ConfigMgr{
        return ConfigMgr.ins()
    }
  
}


