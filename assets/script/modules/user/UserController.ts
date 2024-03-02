import { Controller, ns } from "../../mvc/init"; 
import UserModel from "./UserModel"; 
import OfflineAwardView from "./OfflineAwardView"; 
import CreateRoleView from "./CreateRoleView"; 
const {ccclass} = cc._decorator;@ccclass 
export default class UserController extends Controller{ 
     
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
    public  noticeOfflineAwardViewShow(notification:any){

    }  
     
    public  noticeCreateRoleViewShow(notification:any){

    }  
     
    public  noticeCreateRole(notification:any){

    }  
     
    public  noticeReceiveItem(notification:any){

    }  
     
    public  noticeUpLvEquip(notification:any){

    }  
     
    public  noticeShowDropItem(notification:any){

    }  
     
    public  noticeSetRoleInfo(notification:any){

    }  
     
    public  noticeUpdateRoleInfo(notification:any){

    }  
     
     
     
    protected get model():UserModel{ 
        return ns.models.user 
    } 
 
    /*---------------------------------[views]------------------------------------*/ 
    protected  get offlineAwardView():OfflineAwardView{ 
        return ns.views.offlineAward
    }  
     
    protected  get createRoleView():CreateRoleView{ 
        return ns.views.createRole
    }  
     
 
} 
 
 
 
 
 
 
