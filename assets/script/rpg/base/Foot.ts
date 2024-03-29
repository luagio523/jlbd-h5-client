import {Texture2D, UIOpacity,log, resources, tween, warn } from "cc";
import app from "../../App";
import GameImage from "../../core/common/render/GameImage";
import { SceneManager } from "../manager/SceneManager";


export class Foot {

    public static DEFAULTRES = "images/foot/1";
    public static Name = "Foot";
    private _texture: Texture2D;
    
    public constructor(){
        this.change(Foot.DEFAULTRES);
    }

    public change(path:string) {
        resources.load(path,Texture2D, (err, res)=>{
            if(err) {
                warn("load foot fail", path);
                return;
            }
            this._texture = res;
            log("加载脚印结束", res);
        });
    }

    public createFoot(x:number,y:number){
        if(!app.poolMgr.hasPool(Foot.Name)) {
            app.poolMgr.register(Foot.Name, this._createFootNode.bind(this));
        }
        let footNode:GameImage = app.poolMgr.getPool(Foot.Name).getObject();
        footNode.setTexture(this._texture)
        footNode.setPosition(x,y)

        let uiOpacity = footNode.getComponent(UIOpacity);
        if(!uiOpacity){
            uiOpacity = footNode.addComponent(UIOpacity)
        }
        uiOpacity.opacity = 140;
        SceneManager.Inst.addToDropLayer(footNode)
        tween(uiOpacity)
            .delay(0.5)
            .to(1, {opacity:0})
            .call(()=>{
                footNode.removeFromParent();
                app.poolMgr.getPool(Foot.Name).returnObject(footNode);
            })
            .start();
        app.audio.playEffect("walk");
    }

 

    private _createFootNode() {
        let node = new GameImage();
        return node;
    }

    public clear() {
       
    }
}