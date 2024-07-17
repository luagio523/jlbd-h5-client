import { H5SDKHelper } from "./H5SDKHelper";
import H5Bridge from "./H5Bridge";
import { error, log, sys } from "cc";
import { MethodType, SDKCode } from "./SdkConst";
import { native } from "cc";

export interface INative{
    register(type:number,callback:any):void
    call(methodType:number,args:any):void
}

/**
 * android native处理
 */
export class AndroidNative implements INative {
	public constructor(){
		this.init()
	}

    private _callbacks:any = {}

	private init() {
		let sdkHelper = {
			java2js : function(param){
				this.java2js(param)
			}.bind(this)
		}
		window["sdkHelper"]=sdkHelper; //设定全局 提供给java调用
    }

    private java2js(result:any){
		log("-----java2js-------", JSON.stringify(result))
		let methodType = result.methodType;
		
		let callback = this._callbacks[methodType]
		if(callback){
			setTimeout(() => {
                callback(result)
            }, 0);
		}else{
			console.error(`java2js type not support type: ${methodType}`)
		}
	}

    
    public register(type:number,callback:any):void{
        this._callbacks[type] = callback
    }

    public call(methodType:number,args:any = null){
		
        if(sys.platform == sys.Platform.ANDROID){
			let param = {
				methodType : methodType,
			}
	
			if(args && typeof(args) == "object"){
				Object.assign(param,args)
			}

			let methodData = JSON.stringify(param)
			native.reflection.callStaticMethod("org/cocos2dx/lua/SDKHelper", "js2java", "(Ljava/lang/String;)V",methodData)

        }else{
			error("not support os")
		}
 
    }
}


/**
 * ios native处理
 */
export class IOSNative implements INative{

	private _callbacks:any = {}
	public constructor (){
		this.init()
	}

	private init():void{
		let sdkHelper = {
			oc2js : function(param){
				log("======oc2js====",param)
				this.oc2js(param)
			}.bind(this)
		}
		window["sdkHelper"]=sdkHelper; //设定全局 提供给java调用
		this.initPay()
	}

	private oc2js(param:any){
		
		this.onBoxEvent(MethodType.TYPE_LOGIN,param.errorCode,param)
	}

	private doLogin(){
		// jsb.reflection.callStaticMethod("AppController","loginWx","");

		let jsbRef:any = native.reflection
		jsbRef.callStaticMethod("AppController","loginWx");
	}

	
	/**
	 * box事件处理 兼容
	 * @param type 
	 * @param errorCode 
	 * @param args 
	 */
	protected onBoxEvent(type:number,errorCode:number,args:any){
		let callback = this._callbacks[type]
		if(callback){
			let result = {
				errorCode:errorCode
			}

			if(args && typeof(args) == "object"){
				Object.assign(result,args)
			}
			callback(result)
		}
	}

	/**
	 * 
	 * @param product 
	 */
	protected doPayNotify(product){
		let callback = this._callbacks[MethodType.TYPE_CHECK_ORDER]
		if(callback){
			let result = {
				errorCode:SDKCode.SUCC
			}
			Object.assign(result,product)
			callback(result)
		}else{
			error("you should register TYPE_CHECK_ORDER ")
		}
	}

	

	/**
	 * 初始化sdk box iap 支付
	 */
	private initPay():void{

		let sdkbox 

		sdkbox.IAP.setListener({
			onSuccess : function (product) {
				//Purchase success
				// log(" zhifu  chenggong ",JSON.stringify(product))
				this.onBoxEvent(MethodType.TYPE_PAY,SDKCode.SUCC,product)
				this.doPayNotify(product) //iap 需要主动给后端通知
			}.bind(this),
			onFailure : function (product, msg) {
				//Purchase failed
				//msg is the error message
				// log(" zhifu  onFailure ",JSON.stringify(product))
				this.onBoxEvent(MethodType.TYPE_PAY,SDKCode.ERROR,product)
			}.bind(this),
			onCanceled : function (product) {
				//Purchase was canceled by user
				this.onBoxEvent(MethodType.TYPE_PAY,SDKCode.CANCEL,product)
			}.bind(this),
			onRestored : function (product) {
				// log(" zhifu  onRestored ",JSON.stringify(product))
				//Purchase restored
			}.bind(this),
			onProductRequestSuccess : function (products) {
				//Returns you the data for all the iap products
				//You can get each item using following method
				// for (var i = 0; i < products.length; i++) {
				// 	// loop
				// 	log("onProductRequestSuccess",JSON.stringify(products[i]))
				// }
			}.bind(this),
			onProductRequestFailure : function (msg) {
				//When product refresh request fails.
				log("onProductRequestFailure",msg)
			}.bind(this)
		});

		// 	App 启动后, 尽量早地初始化 IAP .
		// 请先 setListener , 再 init .
		// 如果有多个插件, IAP 的 init 应首先调用.
		let sbox:any = sdkbox
		

		sbox.IAP.init()

		if(sbox.getConfig){
			this._config= JSON.parse(sbox.getConfig())
		}else{
			error("sdkbox getconfig fail,plz check")
		}

		// sdkbox.IAP.setDebug(true);
		sdkbox.IAP.setDebug(false);

		sdkbox.IAP.refresh()// for test
		
	}

	private _config:any

	/**
	 * 注册事件
	 * @param type 
	 * @param callback 
	 */
	public register(type:number,callback:any):void{
        this._callbacks[type] = callback
	}
	

    public call(methodType:number,args:any = null){
		// log(">>>>>>>>>", JSON.stringify(args));
        if(sys.platform == sys.Platform.IOS ){
			// let param = {
			// 	methodType : methodType,
			// }
			
			if(methodType ==MethodType.TYPE_PAY){
				let sdkbox 
				
				sdkbox.IAP.purchase("iap"+ args.shopType + "_" + args.productId) //for test
			}else if(methodType == MethodType.TYPE_INIT){
				this.onInit()
			}else if(methodType == MethodType.TYPE_LOGIN){
				this.doLogin()
			}
			
        }else{
			log("not support os")
		}
	}

	
	

	onInit(){ //模拟一下之后要调用ios配置
		let data = {
			PID:101,
			CHANNEL_ID:10040,
			versionCode:1
		}
		if(this._config && this._config.PID && this._config.CHANNEL_ID && this._config.versionCode){
			data.PID = this._config.PID
			data.CHANNEL_ID = this._config.CHANNEL_ID
			data.versionCode = this._config.versionCode
		}
		this.onBoxEvent(MethodType.TYPE_INIT,SDKCode.SUCC,data)
	}
}

/**
 * h5处理
 */
export class H5Native implements INative{

	public constructor(){
		this.init()
	}

    private _callbacks:any = {}

	private init() {
		console.log(" h5 bridge register")
		H5Bridge.register((result)=>{
			this.sdk2logic(result)
		})
		
    }

    private sdk2logic(result:any){
		console.log("-----sdk2logic-------", JSON.stringify(result))
		let methodType = result.methodType;
		let callback = this._callbacks[methodType]
		if(callback){
			setTimeout(() => {
                callback(result)
            }, 0);
		}else{
			console.error(`sdk2logic type not support type: ${methodType}`)
		}
	}

		/**
	 * 注册事件
	 * @param type 
	 * @param callback 
	 */
	register(type:number,callback:any):void{
		this._callbacks[type] = callback
	}


		/**
	 * 调用native方法
	 * @param methodType 
	 * @param args 
	 */
    call(methodType:number,args:any =null):void{

		if(sys.isBrowser){
			let param = {
				methodType : methodType,
			}
	
			if(args && typeof(args) == "object"){
				Object.assign(param,args)
			}
	
			H5SDKHelper.logic2Sdk(param)
		}else{
			log("not support native")
		}


	}
}


/**
 * 白鹭微端处理
 */
export class EgretNative implements INative{

	public constructor(){
		this.init()
	}

    private _callbacks:any = {}

	private init() {
	
		window["sdk2logic"]=(result)=>{
			this.sdk2logic(result)
		}; //设定全局 提供给java调用

    }

    private sdk2logic(result:any){
		
		console.log("-----sdk2logic-------")

		if(typeof result == "string"){
			console.log("-----sdk2logic-------"+result)
			result = JSON.parse(result)
		}
		
		
		let methodType = result.methodType;
		let callback = this._callbacks[methodType]
		if(callback){
			setTimeout(() => {
                callback(result)
            }, 0);
		}else{
			console.error(`sdk2logic type not support type: ${methodType}`)
		}
	}

		/**
	 * 注册事件
	 * @param type 
	 * @param callback 
	 */
	register(type:number,callback:any):void{
		this._callbacks[type] = callback
	}


		/**
	 * 调用native方法
	 * @param methodType 
	 * @param args 
	 */
    call(methodType:number,args:any =null):void{

		console.log("egret call "+methodType)

		if(sys.isBrowser){
			let param = {
				methodType : methodType,
			}
	
			if(args && typeof(args) == "object"){
				Object.assign(param,args)
			}

			console.log("egret call2 "+methodType)

			if(!window['ExternalInterface']){
				console.log("egret call3 "+methodType)
				console.log("not exist ExternalInterface")
				return
			}

			console.log("egret call4 "+methodType)
			let methodData = JSON.stringify(param)
			console.log(window['ExternalInterface'])
			if(!window['ExternalInterface']['call']){
				console.log("nothings call")
			}

			window['ExternalInterface']['call']("logic2Sdk", methodData);

	
		}else{
			console.log("not support native")
		}


	}
}


export default class SDKManager implements INative{
    private native:INative

	public constructor(){
		this.init()
	}

	private init(){
		if(sys.isNative){
			if(sys.platform == sys.Platform.IOS){
				this.native = new IOSNative()
			}else if(sys.platform == sys.Platform.ANDROID){
				this.native = new AndroidNative()
			}
		}else if(sys.isBrowser){
			if(window['ExternalInterface']){
				console.log("new  egretNative")
				this.native = new EgretNative()
			}else{
				this.native = new H5Native()
			}
		}
	}
	/**
	 * 注册事件
	 * @param type 
	 * @param callback 
	 */
	register(type:number,callback:any):void{
		if(this.native){
			this.native.register(type,callback)
		}else{
			// not support native
		}
	}

	/**
	 * 调用native方法
	 * @param methodType 
	 * @param args 
	 */
    call(methodType:number,args:any =null):void{
		// if(!sys.isNative || !sys.isBrowser){
		// 	console.log("native helper not support !native")
		// 	return 
		// }

		if(this.native){
			this.native.call(methodType,args)
		}else{

			console.log("not support native")
			// not support natice
		}
	}


	private static instance: SDKManager;

    public static getInstance(): SDKManager {
        if (!SDKManager.instance) {
            SDKManager.instance = new SDKManager();
        }
        return SDKManager.instance;
    }
}