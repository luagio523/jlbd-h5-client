/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2023-08-28 10:02:57
 */
import { Component, Game, JsonAsset, Node, _decorator, director, game, screen, sys } from "cc";
import { oops, version } from "./Oops";
import { AudioManager } from "./common/audio/AudioManager";
import { GameManager } from "./game/GameManager";
import { GUI } from "./gui/GUI";

const { ccclass, property } = _decorator;

var isInited = false;

/** 框架显示层根节点 */
export class Root extends Component {
    /** 游戏层节点 */
    @property({
        type: Node,
        tooltip: "游戏层"
    })
    game: Node = null!;

    /** 界面层节点 */
    @property({
        type: Node,
        tooltip: "界面层"
    })
    gui: Node = null!;

    /** 持久根节点 */
    persistRootNode: Node = null!

    async onLoad() {
        if (!isInited) {
            isInited = true;      // 注：这里是规避cc3.8在编辑器模式下运行时，关闭游戏会两次初始化报错

            console.log(`Oops Framework v${version}`);
            this.enabled = false;
            await this.preload()
            this.enabled = true;
            this.run();
        }
    }

   
    /** 加载完引擎配置文件后执行 */
    protected run() {
       
    }

    protected async  preload():Promise<any>{
        // this.enabled = false;

            // let config_name = "config";
            // app.res.load(config_name, JsonAsset, () => {
            //     var config = app.res.get(config_name);
            //     // app.config.btc = new BuildTimeConstants();
            //     app.config.query = new GameQueryConfig();
            //     app.config.game = new GameConfig(config);
            //     app.http.server = app.config.game.httpServer;                                      // Http 服务器地址
            //     app.http.timeout = app.config.game.httpTimeout;                                    // Http 请求超时时间
            //     app.storage.init(app.config.game.localDataKey, app.config.game.localDataIv);      // 初始化本地存储加密
            //     game.frameRate = app.config.game.frameRate;                                         // 初始化每秒传输帧数

            //     this.enabled = true;
            //     this.init();
            //     this.run();
            // });
    }
}