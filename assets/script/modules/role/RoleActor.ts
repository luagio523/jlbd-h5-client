import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { UIView } from "../../config/UIConfig"

import RoleProxy from "./RoleProxy"

import CreateRoleMediator from "./CreateRoleMediator"
import { mvc } from "../../core/mvc/__private"

@mvc.component("RoleActor")
export class RoleActor extends BaseActor {
	public listInterests(): [string, IActionHandler][] {
		return [[Notification.CreateRole_View_show, this.executeCreateRoleViewShow]]
	}

	public onRegister() {
		// 注册逻辑
	}

	/*---------------------------------[notices]------------------------------------*/

	public executeCreateRoleViewShow(args: any) {
		app.log.logView(args, "LoginActor.executeCreateroleViewShow")
		app.gui.open(UIView.CreateRole,{name:"hhh"})
	}

	/*---------------------------------[models]------------------------------------*/

	protected get roleProxy(): RoleProxy {
		return app.facade.retrieveProxy(RoleProxy.NAME) as RoleProxy
	}

	/*---------------------------------[views]------------------------------------*/

	protected get createroleMediator(): CreateRoleMediator {
		return app.facade.retrieveMediator(UIView.CreateRole) as CreateRoleMediator
	}
}
