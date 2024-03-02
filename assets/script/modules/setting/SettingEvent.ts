import {  GameEvent } from "../../mvc/GameEvent"; 
import { Event } from "../../mvc/init"; 
 
const {ccclass} = cc._decorator;@ccclass 
export default class SettingEvent extends Event{ 
    public listEvents(): string[] { 
        return [ 
            GameEvent.Setting_View_Show, 
            "EOF" 
        ]; 
    } 
} 
 
