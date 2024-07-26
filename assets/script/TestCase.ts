import { Asset, Node, SpriteAtlas, SpriteFrame, resources } from "cc";
import {  ActionOptions } from "./rpg/base/ActAnimationState";
import app from "./App";
import { Notification } from "./mvc/Notification";
import { SecureManager, SecureOptions } from "./core/common/secure/SecureManager";
import { testFixedPoint } from './core/common/fixed/fixed';
import { ActType } from "./rpg/enum/Act";
import scheduler from "./utils/scheduler";
import { MathUtil } from "./core/common/utils/MathUtil";
import { AnimResourceType } from "./core/animation/Type";
import { CharacterEditorRenderer } from "./rpg/render/CharacterEditorRenderer";
import { CharacterRenderer } from "./rpg/render/character/CharacterRenderer";



export namespace testcase {

    interface User {
        id: number;
        name: string;
        email: string;
    }

    var gameNode:Node = null;
    var uiNode:Node = null;

    export function app_test_init(game,ui){
        gameNode = game
        uiNode = ui
    }
    

    export function app_test0(){
        app.facade.send(Notification.CREATEROLE_VIEW_SHOW, { name: "test" });
            // resources.load("UI/Battle_atlas0/spriteFrame", SpriteFrame, (err, asset) => {
            //     this.asset = asset;
            //     console.log(err, asset)
            // });
    }
    
    export function app_test1() {
            // console.log("btnTestClick2");
            // let instance = app.gui.get(UIView.CreateRole);
            // console.log(instance.position,instance.width,instance.height);
    
    
            // instance.makeFullScreen();
    
    
            // let timer = scheduler.scheduleGlobal(() => {
            //     console.log("scheduleGlobal23");            
            // }, 2);
    
            // console.log("scheduleGlobal",timer);
    
            // app.gui.close(UIView.CreateRole);
            // resources.release("UI/Battle_atlas0");
    
            // assetManager.releaseAsset(this.asset);
    
            // UIPackage.removePackage("UI/CreateRole")
    
    }
    
    export function app_test2(){
         // let display = new MapDisplay();
        // app.game.getGameRoot().addChild(display);

        // MapManager.getInstance().initMapDisplay(display);

        // MapManager.getInstance().enterMap("map004");

        // EventManager.getInstance().registerListener(Event.EnterMap, function (event) {
        //     console.log("enter map", event);     
            
        //     display.changeMap();
        // });
    }
    
    export function app_test3(){
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
   }

   export function app_test4(){
    console.log(app.config.get("animation"));
   }

   export function app_test5(){
      // await app.config.loadZip("cfg.zip");

            // let ability = await KVManager.getInstance().getAbility("test_lua");
            // console.log(ability,ability.BaseClass);
            // let hero  = await KVManager.getInstance().getHero("npc_dota_hero_huskar_lua");
            // console.log(hero);
            // let item  = await KVManager.getInstance().getItem("item_recipe_arcane_boots2");
            // console.log(item);
            // let unit  = await KVManager.getInstance().getUnit("npc_dota_creature_gnoll_assassin");
            // console.log(unit);
   }

//    contain anim/sheetbody/body803_1_1r.json
    var characterRenderer:CharacterEditorRenderer   = null;
    export async function app_test11(){
        let characterRenderer = new CharacterEditorRenderer();
        characterRenderer.initialize(AnimResourceType.EgretSpriteSheet);
        await characterRenderer.setupCharacter(gameNode);
        characterRenderer.updateCharacterStatus('gamars', 100, 50);

        const actionOptions: ActionOptions = {
            modelName: 'body803',
            action: ActType.ACT_RUN,
            direction: 0,
            gender: 1,
            // callback: () => console.log('Action completed')
        };

        characterRenderer.playAction(actionOptions);

        // characterRenderer.updatePosition(Math.random()*1000,Math.random()*700);

        characterRenderer.updatePosition(500,300);
        scheduler.scheduleUpdateGlobal((dt:number) => {
            characterRenderer.update(dt);
        });
        // characterRenderer.destroy();
    }
    
    export function app_test12(){
        if(characterRenderer){
            const actionOptions: ActionOptions = {
                modelName: 'Heavy',
                action: ActType.ACT_ATTACK,
                // direction: 2,
                // gender: 1,
            };
            characterRenderer.playAction(actionOptions);
        }
    }


    export function app_test13(){
        resources.load("anim/body/father", SpriteAtlas, (err, asset) => {
            console.log("loadResource success callback", err, asset);
            
        });

        resources.load("anim/body/char", SpriteAtlas, (err, asset) => {
            console.log("loadResource success callback", err, asset);
            
        });

        resources.load("anim/item/gold", SpriteAtlas, (err, asset) => {
            console.log("loadResource success callback", err, asset);
            
        });

        // resources.load("test assets/sheep", SpriteAtlas, (err, atlas) => {
        //     const frame = atlas.getSpriteFrame('sheep_down_0');
        //     sprite.spriteFrame = frame;
        // });
    }

    
    export async function app_test15(){
        let characterRenderer = new CharacterRenderer();
        characterRenderer.initialize(AnimResourceType.DragonBones);
        await characterRenderer.setupCharacter(gameNode);
        characterRenderer.updateCharacterStatus('gamars', 100, 50);

        const actionOptions: ActionOptions = {
            modelName: 'Alfadriel',
            action: ActType.ACT_IDLE,
            // direction: 1,
            // gender: 0,
            // times:5,
            // callback: () => console.log('Action completed')
        };

        characterRenderer.playAction(actionOptions);

        // characterRenderer.updatePosition(Math.random()*1000,Math.random()*700);

        characterRenderer.updatePosition(500,300);
        scheduler.scheduleUpdateGlobal((dt:number) => {
            characterRenderer.update(dt);
        });
        // characterRenderer.destroy();
    }
    

    export async function app_test16(){
        let characterRenderer = new CharacterRenderer();
        characterRenderer.initialize(AnimResourceType.Spine);
        await characterRenderer.setupCharacter(gameNode);
        characterRenderer.updateCharacterStatus('gamars', 100, 50);

        const actionOptions: ActionOptions = {
            modelName: 'raptor-pro',
            action: ActType.ACT_WALK,
            // direction: 1,
            // gender: 0,
            // times:5,
            // callback: () => console.log('Action completed')
        };

        characterRenderer.playAction(actionOptions);

        // characterRenderer.updatePosition(Math.random()*1000,Math.random()*700);

        characterRenderer.updatePosition(500,300);
        scheduler.scheduleUpdateGlobal((dt:number) => {
            characterRenderer.update(dt);
        });
        // characterRenderer.destroy();
    }

    
}


