import { SpriteFrame, resources } from "cc";
import { ActResourceType } from "./rpg/base/ActPlayer";
import { CharacterRenderer } from "./rpg/base/CharacterRenderer";
import app from "./App";
import { Notification } from "./mvc/Notification";
import { SecureManager, SecureOptions } from "./core/common/secure/SecureManager";
import { testFixedPoint } from './core/common/fixed/fixed';

var characterRenderer:CharacterRenderer   = null;

export namespace testcase {

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

    
    export function app_test11(){
        characterRenderer = new CharacterRenderer();
        characterRenderer.initialize(ActResourceType.ACT1);
        characterRenderer.setupBody(this.gameNode);
        characterRenderer.updateCharacterStatus('gamars', 100, 50);
       
        // characterRenderer.destroy();
    }
    
    export function app_test12(){
        if(characterRenderer){
            characterRenderer.playAction('attack', () => {
                console.log('Action completed');
            });
        }
    }
    
    


}


