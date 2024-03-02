  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import LoginModel from "./LoginModel"; 
/** 
 * NativeLoginView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class NativeLoginView extends BaseView { 
 
    protected get model():LoginModel{ 
        return ns.models.login 
    } 
 
    protected onRegister(){ 
        this.initViewDef("NativeLogin","NativeLoginWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new NativeLoginWindow(this.view).setAdapter(this).show() 
 
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
class NativeLoginWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/