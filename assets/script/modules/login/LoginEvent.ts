import {  GameEvent } from "../../mvc/GameEvent"; 
import { Event } from "../../mvc/init"; 
 
const {ccclass} = cc._decorator;@ccclass 
export default class LoginEvent extends Event{ 
    public listEvents(): string[] { 
        return [ 
            GameEvent.SdkLogin_View_Show, 
            GameEvent.Native_View_Show, 
            GameEvent.Official_Web_View_Show, 
            GameEvent.Official_Native_Login_View_Show, 
            GameEvent.Login_View_Show, 
            GameEvent.Account_View_Show, 
            GameEvent.GetPassword_View_Show, 
            GameEvent.Fast_Register_Account, 
            GameEvent.Update_Account_Pwd, 
            GameEvent.Get_Login_Type, 
            GameEvent.Auth_Login, 
            GameEvent.Update_Login_Status, 
            GameEvent.Update_Player_Status, 
            GameEvent.Set_New_Password, 
            GameEvent.Get_New_Password_Verify, 
            GameEvent.Get_Player_Status, 
            GameEvent.Get_Customer_Center, 
            GameEvent.Register_Account, 
            GameEvent.Quit_Game, 
            GameEvent.Reset_Login_Staute, 
            GameEvent.UpdateAssets_View_Show, 
            GameEvent.Update_Session_View, 
            GameEvent.Sdk_Auth, 
            GameEvent.Login_Start, 
            GameEvent.WX_Auth, 
            GameEvent.WX_Web_Auth, 
            GameEvent.Official_Login_View, 
            GameEvent.QQ_Web_Auth, 
            GameEvent.Test_Local_Token_Login, 
            "EOF" 
        ]; 
    } 
} 
 
