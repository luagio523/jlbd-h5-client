 
import { _decorator } from "cc";
import app from "../../App";
import BaseMediator from "../../mvc/BaseMediator";
import <%=module%>Proxy from "./<%=module%>Proxy";
const { ccclass, property } = _decorator;
/**
 * <%=Template%>Mediator
 */
@ccclass
export default class <%=Template%>Mediator extends BaseMediator {

    protected get proxy():<%=module%>Proxy{
        return app.facade.retrieveProxy('<%=module2%>') as <%=module%>Proxy
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

