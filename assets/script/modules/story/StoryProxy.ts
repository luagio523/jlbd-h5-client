import { _decorator } from "cc"; 
import BaseProxy from "../../mvc/BaseProxy"; 
const { ccclass, property } = _decorator; 
 
@ccclass 
export default class StoryProxy extends BaseProxy { 
    public static NAME = "Story" 
}