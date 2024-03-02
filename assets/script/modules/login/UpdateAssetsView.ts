  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import LoginModel from "./LoginModel"; 
/** 
 * UpdateAssetsView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class UpdateAssetsView extends BaseView { 
 
    protected get model():LoginModel{ 
        return ns.models.login 
    } 
 
    protected onRegister(){ 
        this.initViewDef("UpdateAssets","UpdateAssetsWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new UpdateAssetsWindow(this.view).setAdapter(this).show() 
 
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
class UpdateAssetsWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/