  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import UserModel from "./UserModel"; 
/** 
 * CreateRoleView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class CreateRoleView extends BaseView { 
 
    protected get model():UserModel{ 
        return ns.models.user 
    } 
 
    protected onRegister(){ 
        this.initViewDef("CreateRole","CreateRoleWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new CreateRoleWindow(this.view).setAdapter(this).show() 
 
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
class CreateRoleWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/