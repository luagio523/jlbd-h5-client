import { Controller, ns } from "../../mvc/init"; 
import StoryModel from "./StoryModel"; 
import StoryView from "./StoryView"; 
const {ccclass} = cc._decorator;@ccclass 
export default class StoryController extends Controller{ 
     
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
     
     
    protected get model():StoryModel{ 
        return ns.models.story 
    } 
 
    /*---------------------------------[views]------------------------------------*/ 
    protected  get storyView():StoryView{ 
        return ns.views.story
    }  
     
 
} 
 
 
 
 
 
 
