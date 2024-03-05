import app from "../App"

/*
 兼容cocos-quick-lua scheduler
*/
export default class scheduler{
    public static performWithDelayGlobal(func:Function,delay:number){
        return app.timerMgr.once(delay,func)
    }

    public static unscheduleGlobal(handle){
        app.timerMgr.remove(handle)
    }

    public static scheduleGlobal(func:any,interval:any):any{
        return  app.timerMgr.loop(interval,func)
    }

    public static scheduleUpdateGlobal(func:any):any{
        return app.timerMgr.frameLoop(func)
    }

    public static scheduleOnce(func:any,interval:any):any{
        return app.timerMgr.once(interval,func)
    }

    public static unscheduleOnce(handle){
        app.timerMgr.remove(handle)
    }

    public static scheduleTimes(func:any, interval:any, repeat:number):any{
        return app.timerMgr.loopTimes(interval, repeat, func)
    }

    public static unscheduleTimes(handle){
        app.timerMgr.remove(handle)
    }
}