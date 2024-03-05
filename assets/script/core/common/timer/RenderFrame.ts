import BaseFrame from "./BaseFrame"

/**
 * 
 * 游戏计时器渲染帧 补偿 实现类
 */
export default class RenderFrame extends BaseFrame{
    public  RealFrameRate:number = 30
    public  _realInterval:number = 0.033
    private _accruedTime:number = 0

    public constructor(frameRate:number = 30){
        super()
        this.RealFrameRate = frameRate
        this._realInterval = (1/frameRate)
    }

    protected render(dt){
        super.render(dt)
    }

    public update(dt){
        if(dt <= this._realInterval){

            this._accruedTime = this._accruedTime + dt
            
            if(this._accruedTime >= this._realInterval){
                this.render(this._realInterval)
                this._accruedTime = this._accruedTime - this._realInterval
            } 


            // this.render(dt)
        }else{


            this._accruedTime = this._accruedTime + dt


            // let rate = Math.floor(this._accruedTime/this._realInterval)


            // if(rate > 2){ //补超过3帧 //一次补回
                this.onceRecoupFrames(this._accruedTime)
               
                this._accruedTime = 0
                
            // }else{
            //     this.recoupFrames(rate,this._realInterval)

            //     this._accruedTime = this._accruedTime  - rate*this._realInterval
            //     if(this._accruedTime > this._realInterval){
            //         this.render(this._realInterval)
            //         this._accruedTime = this._accruedTime -this._realInterval
            //     }
            // }


           


            // let rate = Math.floor(dt/this._realInterval)

            // cc.log(dt,"============xxxx=",rate)
            // if(rate >= 1){
            //     this.recoupFrames(rate,this._realInterval)
            // }
            // this._accruedTime = this._accruedTime + dt - rate*this._realInterval
            // if(this._accruedTime > this._realInterval){
            //     this.render(this._realInterval)
            //     this._accruedTime = this._accruedTime -this._realInterval
            // }
            
        }
    }


    private onceRecoupFrames(dt:number){
        
        this.render(dt)
    }

  

    private recoupFrames(rate:number,interval:number){
        
        let index = 0 
        while(index < rate) {
            this.render(interval)
            index = index  + 1
        }
    }


}

