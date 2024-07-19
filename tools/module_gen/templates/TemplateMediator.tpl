 
import { _decorator } from "cc";
import BaseMediator from "../../mvc/BaseMediator";
import { IActionHandler } from "../../core/mvc/init";
const { ccclass } = _decorator;
/**
 * <%=Template%>Mediator
 */
@ccclass
export default class <%=Template%>Mediator extends BaseMediator {
   

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

    


    public onRemove(){
        super.onRemove() 
    }

    
}

