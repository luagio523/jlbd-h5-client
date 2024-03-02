import {  GameEvent } from "../../mvc/GameEvent"; 
import { Event } from "../../mvc/init"; 
 
const {ccclass} = cc._decorator;@ccclass 
export default class StoryEvent extends Event{ 
    public listEvents(): string[] { 
        return [ 
            "EOF" 
        ]; 
    } 
} 
 
