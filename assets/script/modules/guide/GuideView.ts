  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import GuideModel from "./GuideModel"; 
/** 
 * GuideView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class GuideView extends BaseView { 
 
    protected get model():GuideModel{ 
        return ns.models.guide 
    } 
 
    protected onRegister(){ 
        this.initViewDef("Guide","GuideWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new GuideWindow(this.view).setAdapter(this).show() 
 
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
class GuideWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/