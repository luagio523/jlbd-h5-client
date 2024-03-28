import { log } from "cc";
import { Result } from "./Result";
import { MethodType } from "./SdkConst";

interface ISdkAction{
    init():void; 
    login():void;
    switchLogin():void;
    pay(params:any):void;
    logout():void;
    exit():void;
    submitExtra(params:any):void;
    installApk(url:string):void;
    getRealName():void;
    share(params:any):void;
    copy(text:string):void;
}


export default class SdkAction implements ISdkAction{
     /**
     * 行为
     * @param methodType
     * @param data
     */
    public doAction(methodType:number,  data:any):void{
        log("doAction",""+methodType);
        switch (methodType){
            case MethodType.TYPE_INIT:

                this.init();
                break;
            case MethodType.TYPE_LOGIN:
                this.login();
                break;
            case MethodType.TYPE_SWITCH:
                this.switchLogin();
                break;
            case MethodType.TYPE_LOGOUT:
                this.logout();
                break;
            case MethodType.TYPE_PAY:
                this.pay(data);
                break;
            case MethodType.TYPE_DEFAULT_EXIT:
                this.exit();
                break;
            case MethodType.TYPE_SHARE:
                this.share(data);
                break;
            case MethodType.TYPE_SUBMIT_EXTRA:
                this.submitExtra(data);
                break;
            case MethodType.TYPE_INSTALL_APK:
                this.installApk(data);
                break;
            case MethodType.TYPE_GET_REALNAME:
                this.getRealName();
                break;
            case MethodType.TYPE_COPY:
                this.copy(data);
                break;
            case MethodType.TYPE_OPEN_SERVICE:
                this.openService(data);
                break;

            default:
                log("SDK logic2sdk", "methodName is not support ");
        }
    }

    public openService(data):void{
        log("SDK init", "methodName is not impl ");
    }

    public init():void  {
        log("SDK init", "methodName is not impl ");
    }

    public login():void  {
        log("SDK login", "methodName is not impl ");
    }

    
    public switchLogin() {
        log("SDK switchLogin", "methodName is not impl ");
    }

    
    public pay(data:any) {
        log("SDK pay", "methodName is not impl ");
    }

    
    public logout() {
        log("SDK logout", "methodName is not impl ");
    }

    
    public exit() {
        // Result.create().java2js(TYPE_DEFAULT_EXIT);
    }

    
    public submitExtra(data:any) {
        log("SDK submitExtra", "methodName is not impl ");
    }

    
    public installApk(url:string) {
        log("SDK installApk", "methodName is not impl ");
    }

    
    public getRealName() {
        log("SDK getRealName", "methodName is not impl ");
    }

    
    public share(params:any) {
        log("SDK share", "methodName is not impl ");
    }


    
    public copy(text:string) {
        log("SDK copy", "methodName is not impl ");
    }

    
}