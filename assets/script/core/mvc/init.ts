import { Component, assert, js, log } from "cc";

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function isFunction(value: any): value is Function {
    return typeof value === 'function';
}
 

/**
 * 事件观察者
 */
class Observer{

    private action:IActionHandler;
    private context:any;
    public name:string;

    public constructor(name :string,action:IActionHandler){
        this.name = name
        this.action = action
    }

    public setContext(context:any){
        this.context = context
    }

    public notifyObserver(...args: any[]){
        if(isFunction(this.action)){
            this.action(...args)
        }
    }

    public compareNotifyContext(object:any){
        return object = this.context
    }

}


/**
 * mvc 总控中心
 * 允许你瞎逼改
 * 但别继承Facade
 */
export class Facade{
    protected static _instance:Facade;
    private _observerMap: { [eventName: string]: Observer[] };
    private _actorMap: { [module: string]: Actor };
    _mediatorMap: Object = null;
    _proxyMap: Object = null;

    private _skippedActors:any
    public constructor(){
        this._observerMap = {}
        this._actorMap = {}
        this._skippedActors = {}
        this._mediatorMap = {};
        this._proxyMap = {};	
    }

    public skip(modules:any){
        for (const module in modules) {
            let val = modules[module]
            this._skippedActors[module] = {m : val[0],s : val[1]}
        }
    }

    public static getInstance(){
        if(!this._instance){
            this._instance = new Facade()
        }
        return this._instance
    }

    public retrieveProxy( proxyName:string ):Proxy{
        let proxy = this._proxyMap[proxyName]
        if(!proxy){
            proxy = this.loadProxy(proxyName)
            this._proxyMap[proxyName] = proxy
            proxy.onRegister();
        }
        return proxy
    }

    public retrieveMediator( mediatorName:string ):Mediator{
        let mediator = this._mediatorMap[mediatorName]
        assert(!mediator, "mediator is not register "+mediatorName)
        return mediator
    }


    registerMediator(mediator: Mediator): void {
		var name: string = mediator.getMediatorName();

		if (this._mediatorMap[name])
			return;
		this._mediatorMap[name] = mediator;

        let interests = mediator.listInterests()
        interests.forEach(([eventName, action]) => {
            assert(!eventName, "event is empty on addListener "+eventName)
            assert(isFunction(action), "action is not function on addListener"+ eventName)
            let observer = new Observer(eventName,action)
            observer.setContext(mediator)
            this.registerObserver(eventName, observer)
        });
		mediator.onRegister();
	}


    public removeProxy(proxyName):void{
        let proxy = this._proxyMap[proxyName]
        if(!proxy){
            proxy.onRemove();
        }
    }
   
    public removeMediator(mediatorName):void{
        let mediator = this._mediatorMap[mediatorName]
        if(!mediator){
            mediator.onRemove();
        }
    }

    public registerObserver(eventName:string, observer:Observer){
        if(!eventName||eventName.length <= 0){
            log("facade:registerObserver: eventName is empty")
            return
        }
        if (!this._observerMap[eventName]){
            this._observerMap[eventName] = [observer]
        } else{
            this._observerMap[eventName].push(observer)
        }
    }


    public notifyObservers(eventName: string, ...args: any[]): void {
        if (!eventName || eventName.trim() === "") {
          throw new Error("event is empty");
        }
        const observers = this._observerMap[eventName];
        if (observers) {
          observers.forEach((observer) => {
            observer.notifyObserver(...args);
          });
        }else{
            log(js.formatStr("can not found eventName: [%s] observers",eventName))
        }
    }


    public send(eventName: string, ...args: any[]): void {
        this.notifyObservers(eventName, ...args);
    }


    /**
     * 注册模块
     * 你要保证模块唯一
     * @param modules 
     */
    public registerModules(modules){
        //unique modules
        modules.forEach(module => {
            this.registerActor(module)
        });
    }

    public registerActor(moduleName:string) {
        assert(!!moduleName,"module name is empty")
        let actor = this._actorMap[moduleName]
        assert(!actor,js.formatStr("mobule name[%s] has register",moduleName))
        actor = this.loadActor(moduleName)
        assert(!!actor,js.formatStr("[%s]Actor can not load,plz check class define",moduleName))
        this._actorMap[moduleName] = actor
        actor.onRegister()
        let interests = actor.listInterests()
        interests.forEach(([eventName, action]) => {
            assert(!!eventName, "event is empty on addListener "+eventName)
            assert(isFunction(action), "action is not function on addListener"+ eventName)
            let observer = new Observer(moduleName,action)
            observer.setContext(actor)
            this.registerObserver(eventName, observer)
        });
    }
  

    public loadActor(module:string, controller?:string){
        let controller_ = controller || module
        let className = js.formatStr("%sActor",controller_)
        let classDef:any = js.getClassByName(className)
        if(!classDef){
            return
        }
        return  new classDef()
    }

    public loadProxy(module:string,proxy?:string){
        let proxy_ = proxy || module
        let className = js.formatStr("%sProxy",proxy_)
        let classDef:any = js.getClassByName(className)
        assert(!classDef,js.formatStr("cant found class:[%s]",className))
        return  new classDef()
    }


    public loadMediator(module:string,view?:string){
        let view_ = view || module
        let className = js.formatStr("%sView",view_)
        let classDef:any = js.getClassByName(className)
        assert(!classDef,js.formatStr("cant found class:[%s]",className))
        return  new classDef()
    }


    
}

/**
 * 一个消息通知
 * 继承cc.Component 纯粹为了 cc.js.getClass 
 * 另外视图也恰好需要
 */
export class Notifier extends Component{
    public send(name:string, body?:any){
        Facade.getInstance().send(name,body)
    }   
}

export interface IActionHandler {
    (...args: any): void;
}

/**
 * 控制器基类
 */
export class Actor extends Notifier{
    private moduleName:string 
    public constructor(name:string){
        super()
        this.moduleName = name 
    }

    public onRegister(){

    }
    public onRemove(){
        
    }

    public addListener(eventName:string,action:IActionHandler){
        assert(!!eventName, "event is empty on addListener "+eventName)
        assert(isFunction(action), "action is not function on addListener"+ eventName)

        let observer = new Observer(eventName,action)
        observer.setContext(this)
        Facade.getInstance().registerObserver(eventName, observer)
    }

    
    // let interests: [string, IActionHandler][] = [
    //     ['event1', () => console.log('Handling event 1')],
    //     ['event2', () => console.log('Handling event 2')],
    //   ];
    public listInterests(): [string, IActionHandler][] {
       return []
    }

}


/**
 * 事件
 * 继承cc.Component 纯粹为了 cc.js.getClass 
 */
export class Event extends Component{

}

/**
 * 视图基类
 */
export class Mediator extends Notifier{
    protected mediatorName:string
    protected viewComponent:any 

    public constructor(mediatorName:string,viewComponent:any){
        super()
        this.mediatorName = mediatorName
        this.viewComponent = viewComponent
    }

    public onRegister():void{

    }
    
    public onRemove():void{
        
    }

    public listInterests(): [string, IActionHandler][] {
        return []
    }

    public getMediatorName():string{
        return this.mediatorName
    }
}



/**
 * 数据代理基类
 */
export class Proxy extends Notifier{
    public onRegister():void{
        
    }

    public onRemove():void{

    }
    public constructor(){
        super()
    }
}

