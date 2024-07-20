import { _decorator } from "cc";
import { BaseActor } from "../../mvc/BaseActor";
import { Notification } from "../../mvc/Notification";
import { IActionHandler } from "../../core/mvc/init";
import app from "../../App";
import { UIView } from "../../config/UIConfig";

<% for (var i = 0; i < models.length; i++) { %>import <%= models[i] %>Proxy from "./<%= models[i] %>Proxy";<% } %>

<% for (var i = 0; i < views.length; i++) { %>import <%= views[i] %>Mediator from "./<%= views[i] %>Mediator";<% } %>

const { ccclass } = _decorator;
@ccclass
export class <%= name %>Actor extends BaseActor {
    public listInterests(): [string, IActionHandler][] {
        return [
            <% for (var i = 0; i < events.length; i++) { %>[Notification.<%= events[i] %>, this.execute<%= events[i] %>],
            <% } %>
        ];
    }

    public onRegister() {
        // 注册逻辑
    }

    /*---------------------------------[notices]------------------------------------*/
    <% for (var i = 0; i < events.length; i++) { %>
    public execute<%= events[i] %>(...args: any) {
        // 执行逻辑
    }
    <% } %>

    /*---------------------------------[models]------------------------------------*/
    <% for (var i = 0; i < models.length; i++) { %>
    protected get <%= models[i].toLowerCase() %>Proxy(): <%= models[i] %>Proxy {
        return app.facade.retrieveProxy(<%= models[i] %>Proxy.NAME) as <%= models[i] %>Proxy;
    }
    <% } %>

    /*---------------------------------[views]------------------------------------*/
    <% for (var i = 0; i < views.length; i++) { %>
    protected get <%= views[i].toLowerCase() %>Mediator(): <%= views[i] %>Mediator {
        return app.facade.retrieveMediator(UIView.<%= views[i] %>) as <%= views[i] %>Mediator;
    }
    <% } %>
}