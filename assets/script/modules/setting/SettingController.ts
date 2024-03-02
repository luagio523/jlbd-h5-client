import { Controller, ns } from "../../mvc/init"; 
import SettingModel from "./SettingModel"; 
import SettingView from "./SettingView"; 
const {ccclass} = cc._decorator;@ccclass 
export default class SettingController extends Controller{ 
     
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
    public  noticeSettingViewShow(notification:any){

    }  
     
     
     
    protected get model():SettingModel{ 
        return ns.models.setting 
    } 
 
    /*---------------------------------[views]------------------------------------*/ 
    protected  get settingView():SettingView{ 
        return ns.views.setting
    }  
     
 
} 
 
 
 
 
 
 
