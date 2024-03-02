  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import LoaderModel from "./LoaderModel"; 
/** 
 * LoaderView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class LoaderView extends BaseView { 
 
    protected get model():LoaderModel{ 
        return ns.models.loader 
    } 
 
    protected onRegister(){ 
        this.initViewDef("Loader","LoaderWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new LoaderWindow(this.view).setAdapter(this).show() 
 
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
class LoaderWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/