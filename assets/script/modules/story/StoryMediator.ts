  
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
     
 
     
    protected  onInitialize(): void {
       
        // 初始化逻辑
        // 例如：设置UI元素的初始状态，添加事件监听器等
    }

    protected  onOpen(): void {
        console.log("CreateRoleMediator opened");
        // 打开UI的逻辑
        // 例如：显示创建角色的界面，加载必要的资源等
    }

    protected  onClose(): void {
        console.log("CreateRoleMediator closed");
        // 关闭UI的逻辑
        // 例如：隐藏创建角色的界面，清理临时数据等
    }

    protected onDestroy(): void {
        console.log("CreateRoleMediator destroyed");
        // 清理资源
        // 例如：移除事件监听器，释放占用的内存等
    }
 
     
} 
 
