import { Controller, ns } from "../../mvc/init";
import <%=Template%>Model from "./<%=Template%>Model";<%for(var i = 0; i < importlist.length; i++) {%>
import <%:=importlist[i].name%> from "./<%:=importlist[i].name%>";<%}%>
const {ccclass} = cc._decorator;@ccclass
export default class <%=Template%>Controller extends Controller{
    
    public onRegister(){

    }
    /*---------------------------------[notices]------------------------------------*/<%for(var i = 0; i < evtlist.length; i++) {%>
    <%:=evtlist[i].method%>
    <%}%>
    
    
    protected get model():<%=Template%>Model{
        return ns.models.<%=Template2%>
    }

    /*---------------------------------[views]------------------------------------*/<%for(var i = 0; i < viewlist.length; i++) {%>
    <%:=viewlist[i].method%>
    <%}%>

}






