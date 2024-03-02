import {  GameEvent } from "../../mvc/GameEvent";
import { Event } from "../../mvc/init";

const {ccclass} = cc._decorator;@ccclass
export default class <%=Template%>Event extends Event{
    public listEvents(): string[] {
        return [<%for(var i = 0; i < evtlist.length; i++){%>
            GameEvent.<%:=evtlist[i].name%>,<%}%>
            "EOF"
        ];
    }
}

