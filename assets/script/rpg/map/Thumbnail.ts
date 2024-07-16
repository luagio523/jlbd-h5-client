import { ImageAsset, Node, Sprite, SpriteFrame,  Texture2D,  assetManager, log, resources } from "cc";
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
        log(`Thumbnail load ${url}`)

        resources.load(url, ImageAsset,  (err, asset)=> {
            if (err != null) {
                console.log(err);
                return;
            }

            const texture = new Texture2D();
            texture.image = asset;
    
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;

            
            this.renderSprite.spriteFrame = spriteFrame

            // 使用加载的SpriteFrame
            this.eventDispatcher.dispatchEvent( "Complete");
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