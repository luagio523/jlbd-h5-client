
import { Component, DynamicAtlasManager, Game,  UITransform,  _decorator, director, game, macro, profiler, screen, view  } from 'cc';
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
import { KVManager } from './rpg/manager/KVManager';
import { Notification } from './mvc/Notification';
import { modules } from './mvc/modules';
import { UIManager } from './core/ui/UIManager';
import { Facade } from './core/mvc/init';
import { FairyGUIManager, FairyGuiResManager } from './core/ui/FairyGUIManager';
import { GComponent, GRoot, UIPackage } from 'fairygui-cc';
import { UIView, UI_CONFIG } from './config/UIConfig';
const { ccclass, property } = _decorator;

macro.CLEANUP_IMAGE_CACHE = false;
DynamicAtlasManager.instance.enabled = true;
DynamicAtlasManager.instance.maxFrameSize = 512;

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) profiler.showStats();
    }

    protected async preload():Promise<void>{
        try {
            await app.config.loadDirectory("config/");

            // let ability = await KVManager.getInstance().getAbility("test_lua");
            // console.log(ability,ability.BaseClass);
            // let hero  = await KVManager.getInstance().getHero("npc_dota_hero_huskar_lua");
            // console.log(hero);
            // let item  = await KVManager.getInstance().getItem("item_recipe_arcane_boots2");
            // console.log(item);
            // let unit  = await KVManager.getInstance().getUnit("npc_dota_creature_gnoll_assassin");
            // console.log(unit);
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
        app.game = new GameManager(this.getGameNode());
        //创建ui管理
        app.gui = new UIManager(Facade.getInstance())
        app.gui.initialize(UI_CONFIG);//初始化UI配置

        app.adaption.addRootNode(this.getGameNode(),UIPosition.BottomLeft) //游戏节点适配左下角
        app.adaption.on("adaption-updated", () => { // 屏幕适配更新事件
            app.gui.adaptUI();
        })
    }

    public btnTestClick2() {
        console.log("btnTestClick2");
        let instance = app.gui.get(UIView.CreateRole);
        console.log(instance.position,instance.width,instance.height);


        instance.makeFullScreen();
    }

    public btnTestClick() {
        app.facade.send(Notification.CreateRole_View_show, { name: "test" });
    }
   
    protected async test() {

        console.log(app.config.get("animation"));
        
        
       
        // let display = new MapDisplay();
        // app.game.getGameRoot().addChild(display);

        // MapManager.getInstance().initMapDisplay(display);

        // MapManager.getInstance().enterMap("map004");

        // EventManager.getInstance().registerListener(Event.EnterMap, function (event) {
        //     console.log("enter map", event);     
            
        //     display.changeMap();
        // });
    }


    update(dt: number) {
        // app.game.update(dt);
        // app.ecs.execute(dt);

        app.timer.update(dt);
    }
}