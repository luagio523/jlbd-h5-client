import { Controller, ns } from "../../mvc/init"; 
import LoginModel from "./LoginModel"; 
import NativeLoginView from "./NativeLoginView"; 
import SdkLoginView from "./SdkLoginView"; 
import OfficialWebLoginView from "./OfficialWebLoginView"; 
import OfficialNativeLoginView from "./OfficialNativeLoginView"; 
import LoginView from "./LoginView"; 
import AccountView from "./AccountView"; 
import GetPasswordView from "./GetPasswordView"; 
import UpdateAssetsView from "./UpdateAssetsView"; 
const {ccclass} = cc._decorator;@ccclass 
export default class LoginController extends Controller{ 
     
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
    public  noticeSdkLoginViewShow(notification:any){

    }  
     
    public  noticeNativeViewShow(notification:any){

    }  
     
    public  noticeOfficialWebViewShow(notification:any){

    }  
     
    public  noticeOfficialNativeLoginViewShow(notification:any){

    }  
     
    public  noticeLoginViewShow(notification:any){

    }  
     
    public  noticeAccountViewShow(notification:any){

    }  
     
    public  noticeGetPasswordViewShow(notification:any){

    }  
     
    public  noticeFastRegisterAccount(notification:any){

    }  
     
    public  noticeUpdateAccountPwd(notification:any){

    }  
     
    public  noticeGetLoginType(notification:any){

    }  
     
    public  noticeAuthLogin(notification:any){

    }  
     
    public  noticeUpdateLoginStatus(notification:any){

    }  
     
    public  noticeUpdatePlayerStatus(notification:any){

    }  
     
    public  noticeSetNewPassword(notification:any){

    }  
     
    public  noticeGetNewPasswordVerify(notification:any){

    }  
     
    public  noticeGetPlayerStatus(notification:any){

    }  
     
    public  noticeGetCustomerCenter(notification:any){

    }  
     
    public  noticeRegisterAccount(notification:any){

    }  
     
    public  noticeQuitGame(notification:any){

    }  
     
    public  noticeResetLoginStaute(notification:any){

    }  
     
    public  noticeUpdateAssetsViewShow(notification:any){

    }  
     
    public  noticeUpdateSessionView(notification:any){

    }  
     
    public  noticeSdkAuth(notification:any){

    }  
     
    public  noticeLoginStart(notification:any){

    }  
     
    public  noticeWXAuth(notification:any){

    }  
     
    public  noticeWXWebAuth(notification:any){

    }  
     
    public  noticeOfficialLoginView(notification:any){

    }  
     
    public  noticeQQWebAuth(notification:any){

    }  
     
    public  noticeTestLocalTokenLogin(notification:any){

    }  
     
     
     
    protected get model():LoginModel{ 
        return ns.models.login 
    } 
 
    /*---------------------------------[views]------------------------------------*/ 
    protected  get nativeLoginView():NativeLoginView{ 
        return ns.views.nativeLogin
    }  
     
    protected  get sdkLoginView():SdkLoginView{ 
        return ns.views.sdkLogin
    }  
     
    protected  get officialWebLoginView():OfficialWebLoginView{ 
        return ns.views.officialWebLogin
    }  
     
    protected  get officialNativeLoginView():OfficialNativeLoginView{ 
        return ns.views.officialNativeLogin
    }  
     
    protected  get loginView():LoginView{ 
        return ns.views.login
    }  
     
    protected  get accountView():AccountView{ 
        return ns.views.account
    }  
     
    protected  get getPasswordView():GetPasswordView{ 
        return ns.views.getPassword
    }  
     
    protected  get updateAssetsView():UpdateAssetsView{ 
        return ns.views.updateAssets
    }  
     
 
} 
 
 
 
 
 
 
