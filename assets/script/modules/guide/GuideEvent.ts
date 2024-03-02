import {  GameEvent } from "../../mvc/GameEvent"; 
import { Event } from "../../mvc/init"; 
 
const {ccclass} = cc._decorator;@ccclass 
export default class GuideEvent extends Event{ 
    public listEvents(): string[] { 
        return [ 
            GameEvent.Plot_view_Show, 
            GameEvent.Plot_Step, 
            "EOF" 
        ]; 
    } 
} 
 
