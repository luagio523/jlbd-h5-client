
import { Asset, Component, DynamicAtlasManager, Game,  SpriteFrame,  Texture2D,  UITransform,  _decorator, assetManager, director, game, macro, profiler, resources, screen, view  } from 'cc';
import { DEBUG, JSB } from 'cc/env';
import { Root } from './core/Root';
import app from './App';
import { GameManager } from './core/game/GameManager';
import { UIPosition } from './core/common/Adaption/AdaptionManager';
import { AudioManager } from './core/common/audio/AudioManager';
import { modules } from './mvc/modules';
import { UIManager } from './core/ui/UIManager';
import { Facade } from './core/mvc/init';
import {  UI_CONFIG } from './config/UIConfig';
import { testcase } from './Test';

const { ccclass, property } = _decorator;

macro.CLEANUP_IMAGE_CACHE = false;
DynamicAtlasManager.instance.enabled = true;
DynamicAtlasManager.instance.maxFrameSize = 512;

interface User {
    id: number;
    name: string;
    email: string;
}


@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) profiler.showStats();
    }

    protected async preload():Promise<void>{
        try {
            await app.config.loadDirectory("config/");
        } catch (error) {
            console.error(error);
        }
       
    }

    protected run() {
        if (JSB) {
            app.gui.toast("热更新后新程序的提示");
        }

        // 游戏显示事件
        game.on(Game.EVENT_SHOW, () => {
            app.time.resume();     // 平台不需要在退出时精准计算时间，直接暂时游戏时间
            app.audio.resumeAll();
            director.resume();
            game.resume();
        });

        // 游戏隐藏事件
        game.on(Game.EVENT_HIDE, () => {
            app.time.pause();     // 平台不需要在退出时精准计算时间，直接暂时游戏时间
            app.audio.pauseAll();
            director.pause();
            game.pause();
        });

        this.init();
    }

    protected init() {
        app.facade.registerModules(modules)
        this.initUI();
        this.test();
    }

    /** 初始化游戏UI */
    protected initUI() {
        //创建音频模块
        app.audio = this.persistRootNode.addComponent(AudioManager);
        //创建游戏节点管理器
        app.game = new GameManager(this.gameNode,this.gameCameraNode);
        //创建ui管理
        app.gui = new UIManager(Facade.getInstance())
        app.gui.initialize(UI_CONFIG);//初始化UI配置

        app.adaption.addRootNode(this.gameNode,UIPosition.BottomLeft) //游戏节点适配左下角

        app.secure.initialize("yongyuandexin"); //初始化安全模块
        
    }

    public btnTestClick2() {
       testcase.app_test11();
    }


    public btnTestClick() {
        testcase.app_test12();
    }
   
    protected async test() {
        testcase.app_test4();
    }

    update(dt: number) {
        // app.game.update(dt);
        // app.ecs.execute(dt);
        app.timer.update(dt);
    }
}