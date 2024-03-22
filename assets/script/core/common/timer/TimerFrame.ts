import BaseFrame from "./BaseFrame"

/**
 * 倾向于渲染、特效、动画 60fps，游戏、交互、物理 30fps，AI 10fps.....
 * 游戏计时器渲染帧 补偿 实现类
 */
export default class TimeFrame extends BaseFrame{

    private _accruedTime:number =0
    private _interval:number

    public constructor(frameRate:number = 30){
        super()
        this._interval = 1/frameRate
    }
  
   
    protected render(dt){
        super.render(dt)
    }
    
    public update(dt:number){
        this._accruedTime = this._accruedTime + dt
        if(this._accruedTime >= this._interval){
            this.render(this._interval)
            this._accruedTime = this._accruedTime - this._interval
        } 
    }

}

