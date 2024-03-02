  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import UserModel from "./UserModel"; 
/** 
 * OfflineAwardView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class OfflineAwardView extends BaseView { 
 
    protected get model():UserModel{ 
        return ns.models.user 
    } 
 
    protected onRegister(){ 
        this.initViewDef("OfflineAward","OfflineAwardWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new OfflineAwardWindow(this.view).setAdapter(this).show() 
 
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
class OfflineAwardWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/