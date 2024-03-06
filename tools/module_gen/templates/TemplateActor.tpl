import { _decorator } from "cc";
import { BaseActor } from "../../mvc/BaseActor";
import { Notification } from "../../mvc/Notification";
import { IActionHandler } from "../../mvc/init";
const { ccclass, property } = _decorator;
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
    

}







