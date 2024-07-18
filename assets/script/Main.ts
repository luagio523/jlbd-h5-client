
import { Component, DynamicAtlasManager, Game,  _decorator, director, game, macro, profiler, screen, view  } from 'cc';
import { DEBUG, JSB } from 'cc/env';
import { Root } from './core/Root';
import app from './App';
import { GameManager } from './core/game/GameManager';
import { UIPosition } from './core/common/Adaption/AdaptionManager';
import { MapDisplay } from './rpg/map/MapDisplay';
import MapManager from './rpg/manager/MapManager';
import { EventManager } from './rpg/event/EventListenerManager';
import { Event } from './rpg/event/Event';
import { AudioManager } from './core/common/audio/AudioManager';
const { ccclass, property } = _decorator;

macro.CLEANUP_IMAGE_CACHE = false;
DynamicAtlasManager.instance.enabled = true;
DynamicAtlasManager.instance.maxFrameSize = 512;

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) profiler.showStats();
    }
    protected run() {
        if (JSB) {
            app.gui.toast("热更新后新程序的提示");
        }
        this.init();
    }

    protected init() {
        this.initUI();
        this.test();
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
    }

    protected async preload():Promise<any>{
        // app.config.loadConfig();
        return null 
    }

    /** 初始化游戏UI */
    protected initUI() {
        // // 创建音频模块
        app.audio = this.persistRootNode.addComponent(AudioManager);
        //创建游戏节点管理器
        app.game = new GameManager(this.getGameNode());
        // 适配管理器添加游戏根节点，并设置锚点左下角
        app.adaption.addRootNode(app.game.getGameRoot(),UIPosition.BottomLeft) 
    }

   
   
    protected test() {

        
        let display = new MapDisplay();
        app.game.getGameRoot().addChild(display);

        MapManager.getInstance().initMapDisplay(display);

        MapManager.getInstance().enterMap("map004");

        EventManager.getInstance().registerListener(Event.EnterMap, function (event) {
            console.log("enter map", event);     
            
            display.changeMap();
        });
    }


    update(dt: number) {
        // app.game.update(dt);
        // app.ecs.execute(dt);
    }
}