import { SpriteAtlas, SpriteFrame, js, resources, warn } from "cc"

export default class FrameUtil {

    public static newFrames(atlasUrl:string,frameName:string,start:number = 0,length:number = -1):Array<SpriteFrame>{
        let texAtlas = resources.get(atlasUrl,SpriteAtlas)
        if(!texAtlas){
            warn("you should load atlasUrl at first",atlasUrl)
            return []
        }
        let temp = []

        let end = texAtlas.getSpriteFrames().length 

        if(length == -1){
            if(start == 0){
                return texAtlas.getSpriteFrames() //整个
            }
        }else{
            end = start + length 
        }

        for (let index = start; index < end; index++) {
            let frame = texAtlas.getSpriteFrame(js.formatStr(frameName,index))
            if(!frame){
                // cc.log("cant find "+cc.js.formatStr(frameName,index))
            }else{
                temp.push(frame)
            }
            
        }
        return temp
    }

    public static  newFrame(atlasUrl:string,frameName:string):any{
        let texAtlas = resources.get(atlasUrl,SpriteAtlas)
        if(!texAtlas){
            warn("you should load atlasUrl at first",atlasUrl)
            return null
        }
        let frame = texAtlas.getSpriteFrame(frameName)
        return frame
    }
    
}