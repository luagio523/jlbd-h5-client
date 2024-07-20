import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { UIView } from "../../config/UIConfig"

import AccountProxy from "./AccountProxy"

import LoginMediator from "./LoginMediator"
import { mvc } from "../../core/mvc/__private"

@mvc.component("AccountActor")
export class AccountActor extends BaseActor {
	public listInterests(): [string, IActionHandler][] {
		return [[Notification.Login_View_Show, this.executeLoginViewShow]]
	}

	public onRegister() {
		// 注册逻辑
	}

	/*---------------------------------[notices]------------------------------------*/

	public executeLoginViewShow(args?: any) {
		// 执行逻辑
	}

	/*---------------------------------[models]------------------------------------*/

	protected get accountProxy(): AccountProxy {
		return app.facade.retrieveProxy(AccountProxy.NAME) as AccountProxy
	}

	/*---------------------------------[views]------------------------------------*/

	protected get loginMediator(): LoginMediator {
		return app.facade.retrieveMediator(UIView.Login) as LoginMediator
	}
}
