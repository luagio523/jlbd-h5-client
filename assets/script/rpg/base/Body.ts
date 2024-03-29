import { Node } from "cc";
import GameObject from "./GameObject";
import { DragonPlayer,  MoviePlayer } from "./Player";
import { ResPathUtil } from "../map/ResPathUtil";
import app from "../../App";

export enum BodyAnimType  {
    Frames = 0, //使用帧动画
    Dragon = 1, //使用龙骨
}


/**
 * 
 * 
 */
 export default class MovieBody extends GameObject{

    public static DEFAULTRES = "images/shadow/1";

    private _body:MoviePlayer  //身体

    private animName:string //当前动画名

    public constructor(){
        super()
    }

    public update(dt:number){
        if(this._body){
            this._body.update(dt)
        }
    }
   

    public updateBody(skin:string = null){
        if(!this._body){
            this._body = new MoviePlayer()
            this.addChild(this._body )
        }
        this._body.setAnchor(0.5,0)
    }

    public clear(){
        
    }


    public playAnime(animName:string){
        if(!animName || this.animName == animName){
            return 
        }
        this.animName = animName

        let config = app.config.get("animation")[this.animName];
        if(config){
            this._body.load(config)
        }else{
            this._body.load({
                animUrl:ResPathUtil.GetBodyPath(this.animName)
            })
        }
        this._body.playLoop(animName)
    }

}
