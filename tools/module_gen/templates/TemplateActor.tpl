import { _decorator } from "cc";
import { BaseActor } from "../../mvc/BaseActor";
import { Notification } from "../../mvc/Notification";
import { IActionHandler } from "../../core/mvc/init";
import app from "../../App";
import { UIView } from "../../config/UIConfig";
import <%=Template%>Proxy from "./<%=Template%>Proxy";
<%for(var i = 0; i < importlist.length; i++) {%>
import <%:=importlist[i].name%> from "./<%:=importlist[i].name%>";<%}%>
const { ccclass } = _decorator;
@ccclass
export class <%=Template%>Actor extends BaseActor{
    
    public listInterests(): [string, IActionHandler][] {
        return [<%for(var i = 0; i < evtlist.length; i++) {%>
            [Notification.<%:=evtlist[i].event%>, this.<%:=evtlist[i].method%>],<%}%>
        ];
    }

    public onRegister(){

    }
    /*---------------------------------[notices]------------------------------------*/<%for(var i = 0; i < evtlist.length; i++) {%>
    <%:=evtlist[i].rmethod%>
    <%}%>
    

    public <%=Template2%>Proxy():<%=Template%>Proxy{
        return app.facade.retrieveProxy(<%=Template%>Proxy.NAME) as <%=Template%>Proxy
    }


     /*---------------------------------[views]------------------------------------*/<%for(var i = 0; i < viewlist.length; i++) {%>
    <%:=viewlist[i].method%>
    <%}%>
}







