import { _decorator } from "cc"; 
import app from "../../App"; 
import { INotification } from "../../core/mvc/interfaces/INotification"; 
import { BaseCommand } from "../../mvc/Command"; 
import StoryProxy from "./StoryProxy"; 
import StoryMediator from "./StoryMediator"; 
const { ccclass, property } = _decorator; 
/*---------------------------------[commands]------------------------------------*/ 
export class PlotStepCommand extends BaseCommand{
    public static NAME = "PlotStepCommand"
        execute( notification:INotification )
    {
        
    }
} 
 
 
 
function storyProxy():StoryProxy{ 
    return app.facade.retrieveProxy(StoryProxy.NAME) as StoryProxy 
} 
 
/*---------------------------------[mediators]------------------------------------*/ 
function storyMediator():StoryMediator{ 
    return  app.facade.retrieveMediator(StoryMediator.NAME) as StoryMediator
}  
 
 
 
 
 
 
 
 
 
 
