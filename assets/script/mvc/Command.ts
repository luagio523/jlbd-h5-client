import { Vec3, assert, js, tween } from "cc";
import app from "../App";
import { INotification } from "../core/mvc/interfaces/INotification";
import { SimpleCommand } from "../core/mvc/patterns/command/SimpleCommand";
import { UIID } from "../game/common/config/GameUIConfig";
import { Mediator } from "../core/mvc/patterns/mediator/Mediator";
import { PopViewParams, ViewOption } from "../core/gui/layer/Defines";

export class OpenUICommand extends SimpleCommand{
    public static NAME = "OpenUICommand"
    async execute( notification:INotification ):Promise<void>
    {

        let option  = notification.getBody() as ViewOption
        assert(!!option,"viewOption can not be null")

        let node = await app.gui.openAsync(option.id, option.params);
        let config = app.gui.getConfig(option.id)
        let MediatorCls = js.getClassByName(config.Name)
        let mediator = (new MediatorCls(node,option.params)) as Mediator
        app.facade.registerMediator(mediator)

        
        


        let callbacks: PopViewParams = {
            // 节点添加动画
            onAdded: (node, params) => {
                node.setScale(0.1, 0.1, 0.1);

                tween(node)
                    .to(0.2, { scale: new Vec3(1, 1, 1) })
                    .start();
            },
            // 节点删除动画
            onBeforeRemove: (node, next) => {
                tween(node)
                    .to(0.2, { scale: new Vec3(0.1, 0.1, 0.1) })
                    .call(next)
                    .start();
            },
        }


        
        app.gui.open(option.id,option.params,)
    }
}