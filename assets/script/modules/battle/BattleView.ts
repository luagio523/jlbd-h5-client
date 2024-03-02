  
import BaseView from "../../views/BaseView"; 
import { BaseWindow } from "../../views/BaseWindow"; 
import { ns } from "../../mvc/init";  
import BattleModel from "./BattleModel"; 
/** 
 * BattleView 
 */ 
const {ccclass} = cc._decorator;@ccclass 
export default class BattleView extends BaseView { 
 
    protected get model():BattleModel{ 
        return ns.models.battle 
    } 
 
    protected onRegister(){ 
        this.initViewDef("Battle","BattleWin") 
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
        //window类型 
        new BattleWindow(this.view).setAdapter(this).show() 
 
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
class BattleWindow extends BaseWindow { 
 
    protected onShown(): void { 
        super.onShown() 
    } 
 
} 
**/