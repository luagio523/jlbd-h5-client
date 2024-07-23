import { Sprite, UITransform } from "cc";
import GameImage from "../../core/common/render/GameImage";

/**
 * 缩略图，友善加载体验
 */
 export default class Thumbnail  extends GameImage {
    public constructor(){
        super()
    }
    /**
     * 缩略图是按fixedWidth来设置的，所以需要根据原图的宽高来计算缩放比例
     * @param width 
     * @param height 
     */
    public setSize(width:number,height:number){
        const thumbnailFixedWidth = 64;
        

        // 计算缩放比例
        const scaleX = width / thumbnailFixedWidth;
        const scaleY = scaleX;

        // const thumbnailAspectRatio = height / width;
        // const thumbnailHeight = thumbnailFixedWidth * thumbnailAspectRatio;
        // const scaleY = height / thumbnailHeight;

        // 确保 thumbnail 节点有 UITransform 组件
        let thumbnailTransform = this.getComponent(UITransform);
        thumbnailTransform.setAnchorPoint(0.5, 0.5);

        // 设置 thumbnail 的大小为原地图大小
        thumbnailTransform.setContentSize(width, height);

        // 设置 Sprite 组件并应用纹理
        // let thumbnailSprite = this.getComponent(Sprite);
        // // 设置 Sprite 的缩放模式
        // thumbnailSprite.sizeMode = Sprite.SizeMode.CUSTOM;

        // console.log("thumbnail size:", width, height, "thumbnail fixed size:", thumbnailFixedWidth,  "scaleX:", scaleX, "scaleY:", scaleY);

        // 设置缩略图的缩放
        this.setScale(scaleX, scaleY);
    }
    
}