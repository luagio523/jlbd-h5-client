  
import { _decorator } from "cc"; 
import BaseMediator from "../../mvc/BaseMediator"; 
import { IActionHandler } from "../../mvc/init"; 
const { ccclass } = _decorator; 
/** 
 * StoryMediator 
 */ 
@ccclass 
export default class StoryMediator extends BaseMediator { 
    public static NAME = "Story" 
    public constructor(view:any){ 
        super(StoryMediator.NAME,view) 
    } 
 
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
 
