import { _decorator } from "cc"; 
import {  Notification } from "../../mvc/Notification"; 
const { ccclass, property } = _decorator; 
@ccclass 
export default class StoryNotification { 
    public listNotifications(): string[] { 
        return [ 
            Notification.PLOT_STEP, 
            "EOF" 
        ]; 
    } 
} 
 
