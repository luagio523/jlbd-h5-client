import { _decorator } from "cc";
import {  Notification } from "../../mvc/Notification";
const { ccclass, property } = _decorator;
@ccclass
export default class <%=Template%>Notification {
    public listNotifications(): string[] {
        return [<%for(var i = 0; i < evtlist.length; i++){%>
            Notification.<%:=evtlist[i].name%>,<%}%>
            "EOF"
        ];
    }
}

