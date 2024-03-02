import {  GameEvent } from "../../mvc/GameEvent"; 
import { Event } from "../../mvc/init"; 
 
const {ccclass} = cc._decorator;@ccclass 
export default class UserEvent extends Event{ 
    public listEvents(): string[] { 
        return [ 
            GameEvent.Offline_Award_View_Show, 
            GameEvent.Create_Role_View_Show, 
            GameEvent.Create_Role, 
            GameEvent.Receive_Item, 
            GameEvent.Up_Lv_Equip, 
            GameEvent.Show_Drop_Item, 
            GameEvent.Set_RoleInfo, 
            GameEvent.Update_RoleInfo, 
            "EOF" 
        ]; 
    } 
} 
 
