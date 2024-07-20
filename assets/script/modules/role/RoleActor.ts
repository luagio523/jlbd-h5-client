import { _decorator } from "cc"; 
import { BaseActor } from "../../mvc/BaseActor"; 
import { Notification } from "../../mvc/Notification"; 
import { IActionHandler } from "../../core/mvc/init"; 
import app from "../../App"; 
import { UIView } from "../../config/UIConfig"; 
import RoleProxy from "./RoleProxy"; 
 
import CreateRoleMediator from "./CreateRoleMediator"; 
const { ccclass } = _decorator; 
@ccclass 
export class RoleActor extends BaseActor{ 
     
    public listInterests(): [string, IActionHandler][] { 
        return [ 
            [Notification.CreateRole_View_show, this.executeCreateRoleViewShow], 
        ]; 
    } 
 
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
    public  executeCreateRoleViewShow(...args: any){
        app.log.logView(args, "LoginActor.executeCreateroleViewShow")
		app.gui.open(UIView.CreateRole,{name:"hhh"})
    }  
     
     
 
    public roleProxy():RoleProxy{ 
        return app.facade.retrieveProxy(RoleProxy.NAME) as RoleProxy 
    } 
 
 
     /*---------------------------------[views]------------------------------------*/ 
    protected  get createRoleMediator():CreateRoleMediator{ 
        return app.facade.retrieveMediator(UIView.CreateRole) as CreateRoleMediator
    }  
     
} 
 
 
 
 
 
 
 
