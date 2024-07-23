/*
 * @Author: dgflash
 * @Date: 2022-02-11 09:32:47
 * @LastEditors: dgflash
 * @LastEditTime: 2023-08-21 15:19:56
 */
import { DEBUG } from "cc/env";
import { AudioManager } from "./common/audio/AudioManager";
import { ResLoader } from "./common/loader/ResLoader";
import { Logger } from "./common/log/Logger";
import { GameManager } from "./game/GameManager";
import { UIManager } from "./ui/UIManager";
import { GameTime  } from "./common/timer/GameTime";
import { VMManager } from "./vm/VMManager";


/** 框架核心模块访问入口 */
export class oops {
    /** ----------核心模块---------- */
    /** 日志管理 */
    static log = Logger;
  
    /** 游戏音乐管理 */
    static audio: AudioManager;
    /** 二维界面管理 */
    static gui: UIManager;
     /** 三维游戏世界管理 */
    static game: GameManager ;
   
    /** 资源管理 */
    static res = new ResLoader();
    /** ----------可选模块---------- */
   
    /** 数据绑定管理 */
    static vm = new VMManager();
    /**
     * 游戏时间
     */
    static time = new GameTime()

}

// 引入oops全局变量以方便调试
if (DEBUG) {
    //@ts-ignore
    window.oops = oops;
}