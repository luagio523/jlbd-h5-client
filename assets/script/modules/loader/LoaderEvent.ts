import {  GameEvent } from "../../mvc/GameEvent"; 
import { Event } from "../../mvc/init"; 
 
const {ccclass} = cc._decorator;@ccclass 
export default class LoaderEvent extends Event{ 
    public listEvents(): string[] { 
        return [ 
            GameEvent.Loader_View_Show, 
            "EOF" 
        ]; 
    } 
} 
 
