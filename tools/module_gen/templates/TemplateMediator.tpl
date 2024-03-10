 
import { _decorator } from "cc";
import BaseMediator from "../../mvc/BaseMediator";
import { IActionHandler } from "../../mvc/init";
const { ccclass } = _decorator;
/**
 * <%=Template%>Mediator
 */
@ccclass
export default class <%=Template%>Mediator extends BaseMediator {
    public static NAME = "<%=Template%>"
    public constructor(view:any){
        super(<%=Template%>Mediator.NAME,view)
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

    


    public onRemove(){
        super.onRemove() 
    }

    
}

