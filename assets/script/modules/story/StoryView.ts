  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import StoryModel from "./StoryModel"; 
/** 
 * StoryView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class StoryView extends BaseView { 
 
    protected get model():StoryModel{ 
        return ns.models.story 
    } 
 
    protected onRegister(){ 
        this.initViewDef("Story","StoryWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new StoryWindow(this.view).setAdapter(this).show() 
 
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
class StoryWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/