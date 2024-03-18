import { Node, Sprite, SpriteFrame,  assetManager, log } from "cc";
import { EventDispatcher } from "../../core/common/event/EventDispatcher";
import { ListenerFunc } from "../../core/common/event/EventMessage";

/**
 * 缩略图，友善加载体验
 */
 export default class Thumbnail  extends Node {
    protected renderSprite:Sprite //渲染精灵
    private eventDispatcher:EventDispatcher
    public static MINI_WIDHT = 64
    public static MINI_HEIGHT = 64
    public constructor(){
        super()
        this.eventDispatcher = new EventDispatcher
        this.renderSprite = this.addComponent(Sprite)
    }

    public set source(url:string){
        assetManager.loadBundle(url, SpriteFrame,  (err, bundle)=> {
            if (err != null) {
                console.log(err);
                return;
            }
        
            bundle.load(url, SpriteFrame, (err, spFrame) => {
                if (err != null) {
                    console.log(err);
                    return;
                }
                // 使用加载的SpriteFrame
                this.renderSprite.spriteFrame = spFrame;
                this.eventDispatcher.dispatchEvent( "Complete");
            });
        });
    }

    public addEventListener(eventName:string,listener:ListenerFunc){
        this.eventDispatcher.on(eventName,listener,this)
    }

    public removeEventListener(eventName){
        this.eventDispatcher.off(eventName)
    }

    public setSize(width:number,height:number){
        let scaleX = width/Thumbnail.MINI_WIDHT
        let scaleY = height/Thumbnail.MINI_HEIGHT
        this.setScale(scaleX,scaleY)
    }
    
}