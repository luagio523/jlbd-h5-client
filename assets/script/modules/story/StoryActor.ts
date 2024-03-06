import { _decorator } from "cc"; 
import { BaseActor } from "../../mvc/BaseActor"; 
import { Notification } from "../../mvc/Notification"; 
import { IActionHandler } from "../../mvc/init"; 
import app from "../../App"; 
import StoryProxy from "./StoryProxy"; 
 
import StoryMediator from "./StoryMediator"; 
import StoryGuideMediator from "./StoryGuideMediator"; 
const { ccclass } = _decorator; 
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
     
     
 
    public storyProxy():StoryProxy{ 
        return app.facade.retrieveProxy(StoryProxy.NAME) as StoryProxy 
    } 
 
 
     /*---------------------------------[views]------------------------------------*/ 
    protected  get storyMediator():StoryMediator{ 
        return app.facade.retrieveMediator(StoryMediator.NAME) as StoryMediator
    }  
     
    protected  get storyGuideMediator():StoryGuideMediator{ 
        return app.facade.retrieveMediator(StoryGuideMediator.NAME) as StoryGuideMediator
    }  
     
} 
 
 
 
 
 
 
 
