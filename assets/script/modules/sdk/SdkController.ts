import { Controller, ns } from "../../mvc/init"; 
import SdkModel from "./SdkModel"; 
const {ccclass} = cc._decorator;@ccclass 
export default class SdkController extends Controller{ 
     
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
    public  noticeSdkInit(notification:any){

    }  
     
    public  noticeSdkLogin(notification:any){

    }  
     
    public  noticeSdkLogout(notification:any){

    }  
     
    public  noticeSdkSwitchLogin(notification:any){

    }  
     
    public  noticeSdkPay(notification:any){

    }  
     
    public  noticeSdkExit(notification:any){

    }  
     
    public  noticeGetRealName(notification:any){

    }  
     
    public  noticeShareWechat(notification:any){

    }  
     
    public  noticeShareFriendPage(notification:any){

    }  
     
    public  noticeInstallApk(notification:any){

    }  
     
    public  noticeSdksubmit(notification:any){

    }  
     
    public  noticeSdkReport(notification:any){

    }  
     
    public  noticeSdkOpenService(notification:any){

    }  
     
     
     
    protected get model():SdkModel{ 
        return ns.models.sdk 
    } 
 
    /*---------------------------------[views]------------------------------------*/ 
 
} 
 
 
 
 
 
 
