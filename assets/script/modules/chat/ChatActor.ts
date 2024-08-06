import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { UIView } from "../../config/UIConfig"
import { mvc } from "../../core/mvc/__private"
import ChatProxy from "./ChatProxy"

@mvc.component("ChatActor")
export class ChatActor extends BaseActor {
	public listInterests(): [string, IActionHandler][] {
		return [[Notification.SEND_CHAT_MSG, this.executeSendChatMsg]]
	}

	public onRegister() {
		// 注册逻辑
	}

	/*---------------------------------[notices]------------------------------------*/

	public executeSendChatMsg(...args: any) {
		// 执行逻辑
	}

	/*---------------------------------[models]------------------------------------*/

	protected get chatProxy(): ChatProxy {
		return app.facade.retrieveProxy(ChatProxy.NAME) as ChatProxy
	}

	/*---------------------------------[views]------------------------------------*/
}
