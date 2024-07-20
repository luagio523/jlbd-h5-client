  
import { _decorator } from "cc"; 
import BaseMediator from "../../mvc/BaseMediator"; 
import { IActionHandler } from "../../core/mvc/init"; 
const { ccclass } = _decorator; 
/** 
 * LoginMediator 
 */ 
@ccclass("LoginMediator") 
export default class LoginMediator extends BaseMediator { 
    
 
    public listInterests(): [string, IActionHandler][] { 
        return [ 
            // 在这里添加感兴趣的事件和对应的处理函数 
            // 例如：["Login", this.handleLogin.bind(this)] 
        ]; 
    } 
     
    protected  onInitialize(): void { 
        // 初始化逻辑 
        // 例如：设置UI元素的初始状态，添加事件监听器等 
    } 
 
    protected  onOpen(params: any): void { 
        console.log("LoginMediator opened",params); 
        // 打开UI的逻辑 
    } 
 
    protected  onClose(): void { 
        console.log("LoginMediator closed"); 
        // 关闭UI的逻辑 
        // 例如：清理临时数据等 
    } 
 
    protected onDestroy(): void { 
        console.log("LoginMediator destroyed"); 
        // 清理资源 
        // 例如：释放占用的内存等 
    } 
     
} 
 
