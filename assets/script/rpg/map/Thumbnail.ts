import GameImage from "../../core/common/render/GameImage";

/**
 * 缩略图，友善加载体验
 */
 export default class Thumbnail  extends GameImage {
    public static MINI_WIDHT = 64
    public static MINI_HEIGHT = 64
    public constructor(){
        super()
       
    }

    public setSize(width:number,height:number){
        let scaleX = width/Thumbnail.MINI_WIDHT
        let scaleY = height/Thumbnail.MINI_HEIGHT
        this.setScale(scaleX,scaleY)
    }
    
}