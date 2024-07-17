

/**
 * 定义简洁的游戏中心
 * 方便程序调用
 */

import { oops } from "./core/Oops"
import PoolMgr from "./core/common/pool/PoolMgr"
import { HeapTimerMgr, ITimerMgr } from "./core/common/timer/TimerMgr"
import ConfigMgr from "./manager/ConfigMgr"
import { AdaptionManager } from "./core/common/Adaption/AdaptionManager"
import { Facade } from "./core/mvc/init"
import StorageManager from "./core/common/storage/StorageManager"
import SDKManager from "./core/common/sdk/SDKManager"

// const i18n = require("LanguageData");

export default class app extends oops{
    /** 本地存储 */
    static storage: StorageManager = StorageManager.getInstance();
    /** mvc facade */
    static facade:Facade = Facade.getInstance()
    /** 屏幕适配 */
    static adaption:AdaptionManager = AdaptionManager.getInstance()
    /** 配置 */
    static config:ConfigMgr = ConfigMgr.getInstance()
    /** 对象池管理 */
    static pool:PoolMgr = PoolMgr.getInstance()
    /** 定时器 */
    static timer:ITimerMgr = new HeapTimerMgr()
    /** SDK  */
    static sdk:SDKManager = SDKManager.getInstance()
  
}


