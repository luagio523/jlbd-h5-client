  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import LoginModel from "./LoginModel"; 
/** 
 * SdkLoginView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class SdkLoginView extends BaseView { 
 
    protected get model():LoginModel{ 
        return ns.models.login 
    } 
 
    protected onRegister(){ 
        this.initViewDef("SdkLogin","SdkLoginWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new SdkLoginWindow(this.view).setAdapter(this).show() 
 
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
class SdkLoginWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/