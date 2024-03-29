/**
 * 游戏动画显示对象
 * 基于　配置animal
 */
import { Node, SpriteAtlas, SpriteFrame, UITransform, dragonBones, log, resources } from "cc";
import GameObject from "./GameObject";
import GameRenderObject from "./GameRenderObject";
import MovieClip from "./MovieClip";
import FrameManager from "../manager/FrameManager";
import { EventDispatcher } from "../../core/common/event/EventDispatcher";
import app from "../../App";
import FrameUtil from "../util/FrameUtil";


export interface MovieData{
    interval:number;
    times?:number;
    animUrl:string;
    frameKey:string;
    start?:number ;
    length?:number;
    scale:number;
    anchorX:number;
    anchorY:number;
    frameTb?:Array<SpriteFrame>;
}


 /**
  * 序列帧动画播放器
  */
export  class MovieBody extends  GameRenderObject  {
    public static  DEFAULT_MOVIVE_INTERVAL:number = 200 //默认动画间隔
    protected movieClip:MovieClip


    protected animName:string = null //动画名
    private movieMap:{[key:string]:MovieData}

    protected _complete:Function = null
    
    public getNode(): Node {
        return this
    }

    public constructor() {
        super()
        this.movieClip = new MovieClip()
        this.movieMap = {}
        this.movieClip.setFrameUpdateRender(this.updateFrame.bind(this))
        this.movieClip.setCallback(()=>{
            this.active = false
            if(this._complete){
                this._complete()
            }
        })
        this.movieClip.setSpriteFrameIndex(1)//设置为第一帧
    }



    public playAnime(animName:string){
        if(!animName || this.animName == animName){
            return 
        }
        this.animName = animName

        let movieData = this.movieMap[animName]
        if(!movieData){
            movieData = app.config.get("animation")[this.animName];
            if(movieData){
                this.movieMap[this.animName] = movieData
            }
        }
        if(movieData){
            this.playWithData(animName,movieData)
        }
    }


    protected playWithData(animName:string,movieData:MovieData){
        if(!movieData) return 

        if(movieData.scale){
            this.setScale(movieData.scale,movieData.scale)
        }
        this.setAnchor(movieData.anchorX,movieData.anchorY)
        if(movieData.frameTb){
            this.play(movieData.frameTb)
            return 
        }
        
        this.loadAniAndPlay(animName,movieData.animUrl,
            this.getFrameFormat(animName),movieData.start,movieData.length)
        
    }

    protected play(frames:Array<SpriteFrame>):void{
        this.movieClip.setFrames(frames)
        this.movieClip.playAnime()
    }

    /**
     * 获取帧格式
     * // Elementals_act_0
     * frameKey_animName_%d
     * @param animName 
     * @param frameKey 
     */
    protected getFrameFormat(animName:string){
        let frameFormat = ""
        if(animName){
            frameFormat = frameFormat + animName +"_"
        }
        frameFormat += "%d"
        return frameFormat
    }


    /**
     * 加载动画
     * @param animUrl 
     * @param frameName 
     * @param start 
     * @param length 
     */
    private loadAniAndPlay(animName:string,animUrl:string,frameName:string,start:number = 0,length:number = -1) {
        this.active = true
        resources.load(animUrl, SpriteAtlas, (err, spAtlas) => {
            if (err != null) {
                console.log(err);
                return;
            }
            if(spAtlas && this.active != false){ //加载完后,可能已经移除
                let movieData = this.movieMap[animName]
                if(movieData){
                    movieData.frameTb = FrameUtil.newFrames(animUrl,frameName, start, length)
                    this.play(movieData.frameTb)
                }
            }else{
                log(err)
            }
        });
    }

    
    
    //设置播放间隔
    public setUpdateGap(interval:number){
        this.movieClip.setUpdateGap(interval || 40)
    }

    public update(dt:number){
        if(this.movieClip){
            this.movieClip.update(dt)
        }
    }

    

    /**
     * 获取帧集
     * @param animUrl 
     * @param frameName 
     * @param start 
     * @param end 
     */
    public getFrameTb(animUrl:string,frameName:string,start:number,length:number):any{
        return FrameManager.ins().getFrames(animUrl,frameName,start,length)
    }
    

    public setSpriteFrameIndex(index) {
        this.movieClip.setSpriteFrameIndex(index)
    }

    /**
     * 获取clip
     */
    public get clip():MovieClip{
        return this.movieClip
    }
    

    /**
     * 当在显示层中 移除时
     */
    protected onRemove():void{
        super.onRemove()
        this.movieClip.stopAnime()
        this._complete = null
        this.movieClip.remove()
    }

    /**
     * 当销毁时
     */
    protected onDestroy():void{
        super.onDestroy()
        if(this.movieClip){
            this.movieClip.destroy()
        }
    }
     
 }



 /**
 * 龙骨播放器
 * 还能优化 如渲染层面等
 */
export class DragonPlayer extends GameObject {
    public static DEFAULT_ANIMATION = "Idle";


    protected _display:dragonBones.ArmatureDisplay
    protected _armature:dragonBones.Armature
    protected _aniName:string = DragonPlayer.DEFAULT_ANIMATION
    

    protected _times:number = -1
    protected _complete:Function = null
    protected animUrl:string //ResPathUtil.GetDragonBodyPath(name)
    protected _armatureName:string = "Armature"

    public constructor(){
        super()
        this._display = this.addComponent(dragonBones.ArmatureDisplay)
        this._armature = this._display.armature();

        this._display.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._display.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._display.addEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);

        // dragonBones.CCFactory.getInstance().
    }

    public getNode(): Node {
        return this
    }

    public setAnchor(anchorX:number,anchorY:number):void{
        let transform = this.getComponent(UITransform)
        if (anchorX !== null) {
            transform.anchorX = anchorX
        }
        if (anchorY !== null) {
            transform.anchorY = anchorY
        }
    }

    protected _animationEventHandler(evt:Event){
        if (evt.type === dragonBones.EventObject.FADE_IN_COMPLETE) {
        }
        else if (evt.type === dragonBones.EventObject.FADE_OUT_COMPLETE) {
           
        }
        else if (evt.type === dragonBones.EventObject.COMPLETE) {
            log(" event.animationState.name: ",this._display.animationName)
            if(this._display.animationName == this._aniName){
                if(this._complete){
                    this._complete()
                }
            }
        }
    }
    /**
     * 是否考虑上一个动作未播放完的情况
     * @param animName 
     * @param times -1 表示 使用默认的
     * @param complete 
     */
    public play(animName:string,times:number = -1,complete:Function = null){
        //无需判断相同留给上层逻辑处理
        this._aniName = animName
        this._complete = complete
        this._times = times
        this._times = 0
        this._display.playAnimation(animName,times)
    }
    /**
     * 播放一次
     * @param animName 
     * @param complete 
     */
    public playOnce(animName:string,complete:Function = null){
        this.play(animName,1,complete)
    }

    /**
     * 循环播放
     * @param animName 
     */
    public playLoop(animName){
        this.play(animName,0)
    }


    protected animationState:dragonBones.AnimationState

    protected playAnimation(animName: string, playTimes: number = -1){
       this.animationState =  this._display.playAnimation(animName,playTimes)
    }
    

    /**
     * Hades
     * @param url 
     */
    public load(skinConf:any){
        this.animUrl  = skinConf.animUrl
        if(skinConf.armatureName){
            this._armatureName = skinConf.armatureName
        }
        this.loadAni(this.animUrl,this._armatureName,()=>{
            this._display.playAnimation(this._aniName,this._times)
        })
    }

    

    protected loadAni(animUrl: string, armatureName: string = null, callfunc: Function = null) {
        var dbUrl_ske = animUrl + '_ske';
        var dbUrl_tex = animUrl + '_tex';
        resources.load(dbUrl_tex, dragonBones.DragonBonesAtlasAsset, (err, animasset) => {
            this._display.dragonAtlasAsset = animasset;
            resources.load(dbUrl_ske, dragonBones.DragonBonesAsset, (err, asset) => {
                this._display.dragonAsset = asset;
                this._display.armatureName = armatureName || "Armature";   // '_armatureName'是做龙骨骨骼时里面设置的名字而不是龙骨文件的名字。
                if (callfunc) {
                    callfunc()
                }
            });
        });
    }


  /**
     * 当在显示层中 移除时
     */
    protected onRemove():void{
        this.scale2D(1,1)
        this.angle = 0
        this.animUrl = null
        this._aniName = null
        this._display.dragonAtlasAsset = null;
        this._display.dragonAsset = null;
        this._display.armatureName = "";
    }

    /**
     * 当销毁时
     */
    protected onDestroy():void{
        super.onDestroy()

        this._display.removeEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        this._display.removeEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this._display.removeEventListener(dragonBones.EventObject.COMPLETE, this._animationEventHandler, this);
    }



} 