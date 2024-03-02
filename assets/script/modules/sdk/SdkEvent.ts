import {  GameEvent } from "../../mvc/GameEvent"; 
import { Event } from "../../mvc/init"; 
 
const {ccclass} = cc._decorator;@ccclass 
export default class SdkEvent extends Event{ 
    public listEvents(): string[] { 
        return [ 
            GameEvent.Sdk_Init, 
            GameEvent.Sdk_Login, 
            GameEvent.Sdk_Logout, 
            GameEvent.Sdk_Switch_Login, 
            GameEvent.Sdk_Pay, 
            GameEvent.Sdk_Exit, 
            GameEvent.Get_RealName, 
            GameEvent.Share_Wechat, 
            GameEvent.Share_Friend_Page, 
            GameEvent.Install_Apk, 
            GameEvent.Sdk_submit, 
            GameEvent.Sdk_Report, 
            GameEvent.Sdk_Open_Service, 
            "EOF" 
        ]; 
    } 
} 
 
