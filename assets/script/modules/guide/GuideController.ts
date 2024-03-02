import { Controller, ns } from "../../mvc/init"; 
import GuideModel from "./GuideModel"; 
import GuideView from "./GuideView"; 
import PlotView from "./PlotView"; 
const {ccclass} = cc._decorator;@ccclass 
export default class GuideController extends Controller{ 
     
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
    public  noticePlotviewShow(notification:any){

    }  
     
    public  noticePlotStep(notification:any){

    }  
     
     
     
    protected get model():GuideModel{ 
        return ns.models.guide 
    } 
 
    /*---------------------------------[views]------------------------------------*/ 
    protected  get guideView():GuideView{ 
        return ns.views.guide
    }  
     
    protected  get plotView():PlotView{ 
        return ns.views.plot
    }  
     
 
} 
 
 
 
 
 
 
