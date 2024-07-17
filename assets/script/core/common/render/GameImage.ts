import { ImageAsset, Node, Sprite, SpriteFrame, Texture2D, UITransform, assetManager, resources } from "cc";


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
        resources.load(url, ImageAsset, (err, asset) => {
            if (err != null) {
                console.log(err);
                return;
            }
            const texture = new Texture2D();
            texture.image = asset;
    
            const spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            
            this.renderSprite.spriteFrame = spriteFrame
           
        });
    }

    public setTexture(texture:Texture2D){
        if(this.renderSprite.spriteFrame){
            this.renderSprite.spriteFrame.texture = texture
        }
    }

    public clear(){
        this.url = ""
        if(this.renderSprite.spriteFrame){
            this.renderSprite.spriteFrame = null 
        }
    }
    
    public clone():GameImage{
        let image = new GameImage
        image.source = this.url
        return image
    }
   
}



