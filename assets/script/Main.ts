
import { Component, DynamicAtlasManager, Game,  UITransform,  _decorator, director, game, macro, profiler, screen, view  } from 'cc';
import { DEBUG, JSB } from 'cc/env';
import { Root } from './core/Root';
import app from './App';
import { GameManager } from './core/game/GameManager';
import { UIPosition } from './core/common/Adaption/AdaptionManager';
import { MapDisplay } from './rpg/map/MapDisplay';
import MapManager from './rpg/manager/MapManager';
import { EventManager } from './rpg/event/EventListenerManager';
import { AudioManager } from './core/common/audio/AudioManager';
import { KVManager } from './rpg/manager/KVManager';
import { Notification } from './mvc/Notification';
import { modules } from './mvc/modules';
import { UIManager } from './core/ui/UIManager';
import { Facade } from './core/mvc/init';
import { FairyGUIManager, FairyGuiResManager } from './core/ui/FairyGUIManager';
import { GComponent, GRoot, UIPackage } from 'fairygui-cc';
import { UIView, UI_CONFIG } from './config/UIConfig';
import scheduler from './utils/scheduler';
import { StorageManager } from './core/common/storage/StorageManager';
import { SecureManager, SecureOptions } from './core/common/secure/SecureManager';
import { testFixedPoint } from './core/common/fixed/fixed';
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

            // await app.config.loadZip("cfg.zip");

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

        app.secure.initialize("yongyuandexin"); //初始化安全模块
        
    }

    public btnTestClick2() {
        // console.log("btnTestClick2");
        // let instance = app.gui.get(UIView.CreateRole);
        // console.log(instance.position,instance.width,instance.height);


        // instance.makeFullScreen();


        // let timer = scheduler.scheduleGlobal(() => {
        //     console.log("scheduleGlobal23");            
        // }, 2);

        // console.log("scheduleGlobal",timer);

        app.gui.close(UIView.CreateRole);

    }

    public btnTestClick() {
        app.facade.send(Notification.CREATEROLE_VIEW_SHOW, { name: "test" });



    }

    
    
   
    protected async test() {

        console.log(app.config.get("animation"));

      
        const secureManager = SecureManager.getInstance();
        secureManager.initialize("yongyuandexin");

        // 使用所有安全特性
        const fullSecureData = secureManager.process('Sensitive information', 
            SecureOptions.UseAES | SecureOptions.UseHash | SecureOptions.UseTimestamp | SecureOptions.UseBase64);
        console.log('Full secure:', fullSecureData);
        
        // 只使用 AES 加密和 Base64 编码
        const simpleSecureData = secureManager.process('Sensitive information', 
            SecureOptions.UseAES | SecureOptions.UseBase64);
        console.log('Simple secure:', simpleSecureData);
        
        // 解密完全安全的数据
        const decryptedFull = secureManager.unprocess(fullSecureData, 
            SecureOptions.UseAES | SecureOptions.UseHash | SecureOptions.UseTimestamp | SecureOptions.UseBase64);
        console.log('Decrypted full:', decryptedFull);
        
        // 解密简单安全的数据
        const decryptedSimple = secureManager.unprocess(simpleSecureData, 
            SecureOptions.UseAES | SecureOptions.UseBase64);
        console.log('Decrypted simple:', decryptedSimple);

        
        testFixedPoint();
        
       
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