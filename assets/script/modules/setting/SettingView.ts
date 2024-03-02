  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import SettingModel from "./SettingModel"; 
/** 
 * SettingView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class SettingView extends BaseView { 
 
    protected get model():SettingModel{ 
        return ns.models.setting 
    } 
 
    protected onRegister(){ 
        this.initViewDef("Setting","SettingWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new SettingWindow(this.view).setAdapter(this).show() 
 
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
class SettingWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/