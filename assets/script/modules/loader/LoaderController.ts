import { Controller, ns } from "../../mvc/init"; 
import LoaderModel from "./LoaderModel"; 
import LoaderView from "./LoaderView"; 
const {ccclass} = cc._decorator;@ccclass 
export default class LoaderController extends Controller{ 
     
    public onRegister(){ 
 
    } 
    /*---------------------------------[notices]------------------------------------*/ 
    public  noticeLoaderViewShow(notification:any){

    }  
     
     
     
    protected get model():LoaderModel{ 
        return ns.models.loader 
    } 
 
    /*---------------------------------[views]------------------------------------*/ 
    protected  get loaderView():LoaderView{ 
        return ns.views.loader
    }  
     
 
} 
 
 
 
 
 
 
