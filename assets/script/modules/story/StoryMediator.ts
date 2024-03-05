  
import { _decorator } from "cc"; 
import app from "../../App"; 
import BaseMediator from "../../mvc/BaseMediator"; 
import StoryProxy from "./StoryProxy"; 
const { ccclass, property } = _decorator; 
/** 
 * StoryMediator 
 */ 
 
 
@ccclass 
export default class StoryMediator extends BaseMediator { 
 
    protected get proxy():StoryProxy{ 
        return app.facade.retrieveProxy('story') as StoryProxy 
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
 
