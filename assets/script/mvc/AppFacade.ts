import { js, log } from "cc";
import { Facade } from "../core/mvc/patterns/facade/Facade";
import { Observer } from "../core/mvc/patterns/observer/Observer";


export class Events {
    private _eventListeners:any;
    public constructor(){
        this._eventListeners = {}
    }
    public  getListeners(module:string){
        let listenerFunc = this._eventListeners[module]
        if(typeof(listenerFunc) == "function"){
            return listenerFunc()
        }else if (isArray(listenerFunc)){
            return listenerFunc
        }else{
            log("module: [%s] has no controller", module)
            return null
        }
    }
     //Lazy loading
    public register(module, events){
        if (module && events){
            this._eventListeners[module] = events
        }else{
            throw Error("Event.register failed, module or events is nil")
        }
    }
        
    public checkEvents(){
        //donotings
    }
}

export class AppFacade extends Facade{
    private _events:Events;


    sendNotification( name:string, body:any=null, type:string=null ):void
    {
        if(this.hasCommand(name)){
            return super.sendNotification(name,body,type)
        }

        // this.notifyObservers( new Notification( name, body, type ) );
    }



    /**
     * 注册模块
     * 你要保证模块唯一
     * @param modules 
     */
    public registerModules(modules){
        //unique modules
        modules.forEach(module => {
            this.registerModule(module)
        });
    }

    public registerModule(module:string){
        this.loadNotification(module,null)
        let listeners_ = this._events.getListeners(module)
        let observer_ = null
        
        if(listeners_ && listeners_.length > 0 ){
            // observer_ = new Observer(module,"handleNotification")
            listeners_.forEach(function(eventName){
                // cc.log("=========registerObserver========",eventName)
                this.view.registerObserver(eventName, new Observer( this.executeCommand, this ))
            }.bind(this));
        }
    }

    public loadNotification(module:string,event?:string){
        let event_ = event || module
        let className = js.formatStr("%sNotification",event_)
        let classDef:any = js.getClassByName(className)
        if(!classDef){
            log("module[%s] cant found class:[%s]",module,className)
            return
        }
        let evtIns:any = new classDef()
       
        this.registerNotifications(module,evtIns.listNotifications) //lazy load

        // this.registerNotifications(module,evtIns.listNotifications())// load
    }

    public registerNotifications(module:string,events:any){
        this._events.register(module, events)
    }
}