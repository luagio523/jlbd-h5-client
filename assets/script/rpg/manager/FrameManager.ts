import { SpriteAtlas, js, resources, warn } from "cc"

export default class FrameManager {

    public  newFrames(atlasUrl:string,frameName:string,start:number = 0,length:number = -1):any{
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

    public  newFrame(atlasUrl:string,frameName:string):any{
        let texAtlas = resources.get(atlasUrl,SpriteAtlas)
        if(!texAtlas){
            warn("you should load atlasUrl at first",atlasUrl)
            return null
        }
        let frame = texAtlas.getSpriteFrame(frameName)
        return frame
    }

    public  newDefaultFrame(atlasUrl:string,frameName:string):any{
        return this.newFrame(atlasUrl,frameName)
    }
    
    /**
     * 获取默认帧
     * @param atlasUrl 
     * @param frameName 
     */
    public getDefaultFrame(atlasUrl:string,frameName:string):any{
        let key = atlasUrl+frameName
        if(!this._defaultFrameMap[key]){
            this._defaultFrameMap[key] = this.newDefaultFrame(atlasUrl,frameName)
        }
        return this._defaultFrameMap[key]
    }

    /**
     * 获取帧map
     * 假定 frameName 唯一  start,end　固定
     * @param atlasUrl 
     * @param frameName 
     * @param start 
     * @param end 
     */
    public getFrames(atlasUrl:string,frameName:string,start?:number,length?:number){
        let key = atlasUrl+frameName
        if(!this._framesMap[key]){
            
            this._framesMap[key] = this.newFrames(atlasUrl,frameName, start, length)
        }
        return this._framesMap[key]
    }


    public getFrame(atlasUrl:string,frameName:string){
        return this.newFrame(atlasUrl,frameName)
    }

    public clear(){

        this._framesMap = {}
        this._defaultFrameMap = {}
    }

    

    static ins():FrameManager
    {
        if(!this.inst)
        {
            this.inst = new FrameManager();
        }
        return this.inst;
    }

    private _framesMap:any = null
    private _defaultFrameMap:any = null

    public constructor(){
       this._framesMap = {}
       this._defaultFrameMap = {}
    }


    private static inst:FrameManager; 
    
}