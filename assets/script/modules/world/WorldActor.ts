import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { UIView } from "../../config/UIConfig"
import { mvc } from "../../core/mvc/__private"
import WorldProxy from "./WorldProxy"

@mvc.component("WorldActor")
export class WorldActor extends BaseActor {
	public listInterests(): [string, IActionHandler][] {
		return [[Notification.ENTER_WORLD, this.executeEnterWorld]]
	}

	public onRegister() {
		// 注册逻辑
	}

	/*---------------------------------[notices]------------------------------------*/

	public executeEnterWorld(...args: any) {
		// 执行逻辑
	}

	/*---------------------------------[models]------------------------------------*/

	protected get worldProxy(): WorldProxy {
		return app.facade.retrieveProxy(WorldProxy.NAME) as WorldProxy
	}

	/*---------------------------------[views]------------------------------------*/
}
