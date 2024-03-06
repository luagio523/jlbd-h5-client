import { _decorator } from "cc";
import app from "../../App";
import { INotification } from "../../core/mvc/interfaces/INotification";
import { BaseCommand } from "../../mvc/Command";
import <%=Template%>Proxy from "./<%=Template%>Proxy";<%for(var i = 0; i < importlist.length; i++) {%>
import <%:=importlist[i].name%> from "./<%:=importlist[i].name%>";<%}%>
const { ccclass, property } = _decorator;
/*---------------------------------[commands]------------------------------------*/<%for(var i = 0; i < evtlist.length; i++) {%>
<%:=evtlist[i].method%>
<%}%>


function <%=Template2%>Proxy():<%=Template%>Proxy{
    return app.facade.retrieveProxy(<%=Template%>Proxy.NAME) as <%=Template%>Proxy
}

/*---------------------------------[mediators]------------------------------------*/<%for(var i = 0; i < viewlist.length; i++) {%>
<%:=viewlist[i].method%>
<%}%>









