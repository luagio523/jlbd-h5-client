import { TimerMgr } from "./TimerMgr";

/**
 * 暂时先简单实现吧
 * 也没啥过多的需求
 */
export default class BaseFrame {

    protected playTimer:number = 0
    protected timerRenders:Array<any> = new Array()

    public constructor(){

    }

    /**
     * 添加定时
     * @param timer 
     */
    public addTimer(timer){
        this.timerRenders.push(timer)

        return this
    }


    public update(dt){
    }

    protected render(dt){
        this.timerRenders.forEach(timer => {
            timer(dt)
        });
    }
    
    public play(){
        if(this.playTimer ==0){
            this.playTimer = TimerMgr.ins().frameLoop(this.update.bind(this))
        }
        return this
    }

    public stop(){
        if(this.playTimer !=0 ){
            TimerMgr.ins().remove(this.playTimer)
            this.playTimer = 0
        }
    }

    public clear(){
        this.stop()
        this.timerRenders = new Array()
    }
}