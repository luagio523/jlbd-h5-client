  
import { _decorator } from "cc"; 
import BaseMediator from "../../mvc/BaseMediator"; 
import { IActionHandler } from "../../mvc/init"; 
const { ccclass, property } = _decorator; 
/** 
 * StoryGuideMediator 
 */ 
@ccclass 
export default class StoryGuideMediator extends BaseMediator { 
    public static NAME = "StoryGuide" 
 
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
 
