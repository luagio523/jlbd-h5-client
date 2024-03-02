  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import BattleModel from "./BattleModel"; 
/** 
 * MsgView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class MsgView extends BaseView { 
 
    protected get model():BattleModel{ 
        return ns.models.battle 
    } 
 
    protected onRegister(){ 
        this.initViewDef("Msg","MsgWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new MsgWindow(this.view).setAdapter(this).show() 
 
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
class MsgWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/