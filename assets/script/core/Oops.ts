/*
 * @Author: dgflash
 * @Date: 2022-02-11 09:32:47
 * @LastEditors: dgflash
 * @LastEditTime: 2023-08-21 15:19:56
 */
import { DEBUG } from "cc/env";
import { LanguageManager } from "../libs/gui/language/Language";
import { AudioManager } from "./common/audio/AudioManager";
import { MessageManager } from "./common/event/MessageManager";
import { ResLoader } from "./common/loader/ResLoader";
import { Logger } from "./common/log/Logger";
import { RandomManager } from "./common/random/RandomManager";
import { GameManager } from "./game/GameManager";
import StorageManager from "./common/storage/StorageManager";
import { ViewModelMgr } from "./vm/vm";
import { UIManager } from "./ui/UIManager";
import { GameTimer } from "./common/timer/GameTimer";
import { Facade } from "./mvc/init";

/** 框架版本号 */
export var version: string = "1.1.5";

/** 框架核心模块访问入口 */
export class oops {
    /** ----------核心模块---------- */

    /** 日志管理 */
    static log = Logger;
   
    /** 全局消息 */
    static message: MessageManager = MessageManager.Inst;
    /** 随机工具 */
    static random = RandomManager.Inst;
    /** 本地存储 */
    static storage: StorageManager = StorageManager.Inst;
  
    /** 游戏音乐管理 */
    static audio: AudioManager;
    
    /** 二维界面管理 */
    static gui: UIManager;
     /** mvc facade */
    static facade:Facade = Facade.getInstance()

    /** 三维游戏世界管理 */
    static game: GameManager;
   
    /** 资源管理 */
    static res = new ResLoader();
    /** ----------可选模块---------- */

    /** 多语言模块 */
    static language: LanguageManager;
   
    /** 数据绑定管理 */
    static vm = new ViewModelMgr;
    /**
     * 游戏时间
     */
    static time = new GameTimer

}

// 引入oops全局变量以方便调试
if (DEBUG) {
    //@ts-ignore
    window.oops = oops;
}