import { _decorator } from "cc"; 
import { BaseActor } from "../../mvc/BaseActor"; 
import { Notification } from "../../mvc/Notification"; 
import { IActionHandler } from "../../mvc/init"; 

const { ccclass, property } = _decorator; 
@ccclass 
export class StoryActor extends BaseActor{ 
     
    public listInterests(): [string, IActionHandler][] { 
        return [ 
            [Notification.PLOT_STEP, this.executePlotStep], 
        ]; 
    } 
 
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
    public  executePlotStep(...args: any){

    }  
     
     
 
} 
 
 
 
 
 
 
 
