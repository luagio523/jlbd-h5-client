import { MethodType } from "../../consts/SdkConst";
import { Result } from "./Result";

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
        cc.log("doAction",""+methodType);
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
                cc.log("SDK logic2sdk", "methodName is not support ");
        }
    }

    public openService(data):void{
        cc.log("SDK init", "methodName is not impl ");
    }

    public init():void  {
        cc.log("SDK init", "methodName is not impl ");
    }

    public login():void  {
        cc.log("SDK login", "methodName is not impl ");
    }

    
    public switchLogin() {
        cc.log("SDK switchLogin", "methodName is not impl ");
    }

    
    public pay(data:any) {
        cc.log("SDK pay", "methodName is not impl ");
    }

    
    public logout() {
        cc.log("SDK logout", "methodName is not impl ");
    }

    
    public exit() {
        // Result.create().java2js(TYPE_DEFAULT_EXIT);
    }

    
    public submitExtra(data:any) {
        cc.log("SDK submitExtra", "methodName is not impl ");
    }

    
    public installApk(url:string) {
        cc.log("SDK installApk", "methodName is not impl ");
    }

    
    public getRealName() {
        cc.log("SDK getRealName", "methodName is not impl ");
    }

    
    public share(params:any) {
        cc.log("SDK share", "methodName is not impl ");
    }


    
    public copy(text:string) {
        cc.log("SDK copy", "methodName is not impl ");
    }

    
}