

/**
 * 定义简洁的游戏中心
 * 方便程序调用
 */

import { oops } from "./core/Oops"
import {  ITimerMgr, LinkListTimerMgr,HeapTimerMgr } from "./core/common/timer/TimerMgr"
import  { ConfigManager } from "./core/common/config/ConfigManager"
import { AdaptionManager } from "./core/common/adaption/AdaptionManager"
import { Facade } from "./core/mvc/init"
import SDKManager from "./core/common/sdk/SDKManager"
import { StorageManager } from "./core/common/storage/StorageManager"
import { RandomManager } from "./core/common/random/RandomManager"
import {  MessageSubscriber } from "./core/common/event/MessageManager"

import { LanguageManager } from "./core/common/i18n/LanguageManager"
import { LocationManager } from "./core/common/location/LocationMgr"
import { PoolManager } from "./core/common/pool/PoolManager"
import { HttpRequest } from "./core/network/HttpRequest"
import { NetManager } from "./core/network/NetManager"
import { CacheManager } from "./core/cache/CacheManager"
import { SecureManager } from "./core/common/secure/SecureManager"


export default class app extends oops{

    /** 全局消息订阅 */
    static message: MessageSubscriber = new MessageSubscriber;
    /** 随机工具 */
    static random:RandomManager = RandomManager.getInstance();
    /** 本地存储 */
    static storage: StorageManager = StorageManager.getInstance();
    /** 网络请求 */
    static secure:SecureManager = SecureManager.getInstance();
    /** 屏幕适配 */
    static adaption:AdaptionManager = AdaptionManager.getInstance()
    /** 配置 */
    static config:ConfigManager = ConfigManager.getInstance()
    /** 对象池管理 */
    static pool:PoolManager = PoolManager.getInstance()
    /** 定时器 */
    static timer:ITimerMgr = new LinkListTimerMgr()
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
    /** cache用于缓存用户数据 */
    static cache:CacheManager = CacheManager.getInstance()
     /** mvc facade */
    static facade:Facade = Facade.getInstance()

   
}


