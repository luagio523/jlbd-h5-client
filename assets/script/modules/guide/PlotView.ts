  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import GuideModel from "./GuideModel"; 
/** 
 * PlotView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class PlotView extends BaseView { 
 
    protected get model():GuideModel{ 
        return ns.models.guide 
    } 
 
    protected onRegister(){ 
        this.initViewDef("Plot","PlotWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new PlotWindow(this.view).setAdapter(this).show() 
 
        //panel类型时 
        //new BasePanel(this.view).setAdapter(this).show() 
         
    } 
 
    /** 
     * 初始化数据 
     */ 
    protected initData(){ 
         
    } 
 
     
 
    public onDestroy() { 
        super.onDestroy() 
    } 
} 
 
/** 
class PlotWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/