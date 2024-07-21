import app from "../App"

/*
 兼容cocos-quick-lua scheduler
*/
export default class scheduler{
    public static performWithDelayGlobal(func:Function,delay:number){
        return app.timer.once(delay,func)
    }

    public static unscheduleGlobal(handle){
        app.timer.remove(handle)
    }

    public static scheduleGlobal(func:any,interval:any):any{
        return  app.timer.loop(interval,func)
    }

    public static scheduleUpdateGlobal(func:any):any{
        return app.timer.frameLoop(func)
    }

    public static scheduleOnce(func:any,interval:any):any{
        return app.timer.once(interval,func)
    }

    public static unscheduleOnce(handle){
        app.timer.remove(handle)
    }

    public static scheduleTimes(func:any, interval:any, repeat:number):any{
        return app.timer.loopTimes(interval, repeat, func)
    }

    public static unscheduleTimes(handle){
        app.timer.remove(handle)
    }
}