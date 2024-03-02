import {  GameEvent } from "../../mvc/GameEvent"; 
import { Event } from "../../mvc/init"; 
 
const {ccclass} = cc._decorator;@ccclass 
export default class BattleEvent extends Event{ 
    public listEvents(): string[] { 
        return [ 
            GameEvent.Battle_View_Show, 
            GameEvent.Show_Blood, 
            GameEvent.Show_Drop_Item, 
            GameEvent.Update_CharRoleInfo, 
            GameEvent.Update_Gold, 
            GameEvent.Update_Equip, 
            GameEvent.Receive_Item, 
            GameEvent.Update_Statistic, 
            GameEvent.Lock_View_Show, 
            GameEvent.MapBig_View_Show, 
            GameEvent.Send_Chat_Msg, 
            GameEvent.Boss_Borth, 
            GameEvent.Show_Tombstone, 
            GameEvent.Hide_Tombstone, 
            GameEvent.Enter_Area, 
            GameEvent.Leave_Area, 
            GameEvent.Boss_Hp_Update, 
            GameEvent.Role_Resurrection, 
            GameEvent.Show_Msg, 
            GameEvent.Vmg_MsgSure_View_show, 
            GameEvent.Update_Area_Lock, 
            "EOF" 
        ]; 
    } 
} 
 
