  
import { _decorator } from "cc"; 
import BaseMediator from "../../mvc/BaseMediator"; 
import { IActionHandler } from "../../core/mvc/init";
const { ccclass } = _decorator; 
/** 
 * StoryMediator 
 */ 
@ccclass 
export default class StoryMediator extends BaseMediator { 
    
 
    public listInterests(): [string, IActionHandler][] { 
        return [] 
    } 
     
 
    public onRegister(){ 
        super.onRegister()  
    } 
 
     
 
    /** 
     * 初始化ui 
     */ 
    protected initUI(){ 
       
         
    } 
 
    /** 
     * 初始化数据 
     */ 
    protected initData(){ 
         
    } 
 
 
    public onRemove(){ 
        super.onRemove()  
    } 
 
     
} 
 
