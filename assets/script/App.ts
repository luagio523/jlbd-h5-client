

/**
 * 定义简洁的游戏中心
 * 方便程序调用
 */

import { oops } from "./core/Oops"
import PoolMgr from "./core/common/pool/PoolMgr"
import { HeapTimerMgr, ITimerMgr } from "./core/common/timer/TimerMgr"
import  { ConfigManager } from "./manager/ConfigManager"
import { AdaptionManager } from "./core/common/Adaption/AdaptionManager"
import { Facade } from "./core/mvc/init"
import SDKManager from "./core/common/sdk/SDKManager"
import { StorageManager } from "./core/common/storage/StorageManager"
import { RandomManager } from "./core/common/random/RandomManager"
import {  MessageSubscriber } from "./core/common/event/MessageManager"
import { HttpRequest } from "./libs/network/HttpRequest"
import { NetManager } from "./libs/network/NetManager"
import { LanguageManager } from "./core/common/i18n/LanguageManager"
import { LocationManager } from "./core/common/location/LocationMgr"

// const i18n = require("LanguageData");

export default class app extends oops{

    /** 全局消息订阅 */
    static message: MessageSubscriber = new MessageSubscriber;
    /** 随机工具 */
    static random:RandomManager = RandomManager.getInstance();
    /** 本地存储 */
    static storage: StorageManager = StorageManager.getInstance();
    /** 屏幕适配 */
    static adaption:AdaptionManager = AdaptionManager.getInstance()
    /** 配置 */
    static config:ConfigManager = ConfigManager.getInstance()
    /** 对象池管理 */
    static pool:PoolMgr = PoolMgr.getInstance()
    /** 定时器 */
    static timer:ITimerMgr = new HeapTimerMgr()
    /** 本地参数 */
    static location:LocationManager = LocationManager.getInstance()
    /** SDK  */
    static sdk:SDKManager = SDKManager.getInstance()
    /** 语言本地化管理 */
    static language:LanguageManager = LanguageManager.getInstance()
    /** http */
    static http:HttpRequest = new HttpRequest() 
    /** net  */
    static net:NetManager = NetManager.getInstance()
     /** mvc facade */
    static facade:Facade = Facade.getInstance()
}


