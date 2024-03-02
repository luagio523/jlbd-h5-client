import { Controller, ns } from "../../mvc/init"; 
import RankModel from "./RankModel"; 
import RankView from "./RankView"; 
const {ccclass} = cc._decorator;@ccclass 
export default class RankController extends Controller{ 
     
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
    public  noticeRankViewShow(notification:any){

    }  
     
     
     
    protected get model():RankModel{ 
        return ns.models.rank 
    } 
 
    /*---------------------------------[views]------------------------------------*/ 
    protected  get rankView():RankView{ 
        return ns.views.rank
    }  
     
 
} 
 
 
 
 
 
 
