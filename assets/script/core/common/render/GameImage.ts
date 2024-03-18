import { Node, Sprite, SpriteFrame, UITransform, assetManager } from "cc";


/**
 * 游戏图片
 */
export default class GameImage extends Node {
    
    protected renderSprite:Sprite //渲染精灵
    protected url:string //
    public constructor(){
        super()
        this.renderSprite = this.addComponent(Sprite)
    }

    public setAnchor(x:number,y:number){
        let transform = this.getComponent(UITransform)
        transform.anchorX = x 
        transform.anchorY = y 
    }

    public isload(url:string){
        if(this.url == url && this.renderSprite.spriteFrame){
            return true 
        }
        return false 
    }

    public set source(url:string){
        if(this.isload(url))return 
        this.clear() //清除原有的
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
            });
        });
     
    }

    public clear(){
        this.url = ""
        if(this.renderSprite.spriteFrame){
            this.renderSprite.spriteFrame = null 
        }
    }
    
   
}



