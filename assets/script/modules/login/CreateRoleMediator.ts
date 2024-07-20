  
import { _decorator } from "cc"; 
import BaseMediator from "../../mvc/BaseMediator"; 
import { IActionHandler } from "../../core/mvc/init"; 
import { NameGenerator } from "../../core/common/name/NameGenerator";
import app from "../../App";
import { GTextInput } from "fairygui-cc";
const { ccclass } = _decorator; 
/** 
 * CreateRoleMediator 
 */ 
@ccclass("CreateRoleMediator") 
export default class CreateRoleMediator extends BaseMediator { 
    private nameGenerator: NameGenerator = new NameGenerator();

    private inputName: GTextInput;
 
    public listInterests(): [string, IActionHandler][] { 
        return [ 
            // 在这里添加感兴趣的事件和对应的处理函数 
            // 例如：["Login", this.handleLogin.bind(this)] 
        ]; 
    } 


    
     
    protected  onInitialize(): void { 
        // 初始化逻辑 
        // 例如：设置UI元素的初始状态，添加事件监听器等 

        this.safeClick("btn_create", this.onBtnCreateClick, this);
        this.safeClick("btn_roll", this.onBtnRollClick, this);


        app.config.loadSingle("name_generator").then(()=>{
            let nameGeneratorConfig = app.config.get("name_generator");
            if(nameGeneratorConfig){
                this.nameGenerator.initialize(nameGeneratorConfig);
            }
        })
      
        this.inputName = <GTextInput>this.findChild("input_name");

    } 

    private onBtnCreateClick() {
        console.log("create role click");
    }

    private onBtnRollClick() {
        console.log("roll click");
    }

 
    protected  onOpen(params: any): void { 
        console.log("CreateRoleMediator opened",params); 
        // 打开UI的逻辑 
    } 
 
    protected  onClose(): void { 
        console.log("CreateRoleMediator closed"); 
        this.nameGenerator.release();
        app.config.releaseSingle("name_generator");
    } 
 
    protected onDestroy(): void { 
        console.log("CreateRoleMediator destroyed"); 
        // 清理资源 
        // 例如：释放占用的内存等 
    } 
     
} 
 
