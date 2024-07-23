import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { UIView } from "../../config/UIConfig"
import { mvc } from "../../core/mvc/__private"

import HeadUpDisplayMediator from "./HeadUpDisplayMediator"
import GEONavigationMediator from "./GEONavigationMediator"
@mvc.component("GameActor")
export class GameActor extends BaseActor {
	public listInterests(): [string, IActionHandler][] {
		return [
			[Notification.ENTER_WORLD, this.executeEnterWorld],
			[Notification.HEADUPDISPLAY_VIEW_SHOW, this.executeHeadupdisplayViewShow],
			[Notification.GEONAVIGATION_VIEW_SHOW, this.executeGeonavigationViewShow],
		]
	}

	public onRegister() {
		// 注册逻辑
	}

	/*---------------------------------[notices]------------------------------------*/
	public executeGeonavigationViewShow() {
		// 执行逻辑
		app.gui.open(UIView.GEONavigation)
	}

	public executeEnterWorld(role: any) {
		this.sendNotification(Notification.HEADUPDISPLAY_VIEW_SHOW, role)
		// 执行逻辑
		console.log("GameActor:executeEnterWorld")
	}

	public executeHeadupdisplayViewShow(role: any) {
		// 执行逻辑
		app.gui.open(UIView.HeadUpDisplay, role)
	}

	/*---------------------------------[models]------------------------------------*/

	/*---------------------------------[views]------------------------------------*/
	protected get geonavigationMediator(): GEONavigationMediator {
		return app.facade.retrieveMediator(
			UIView.GEONavigation,
		) as GEONavigationMediator
	}

	protected get headupdisplayMediator(): HeadUpDisplayMediator {
		return app.facade.retrieveMediator(
			UIView.HeadUpDisplay,
		) as HeadUpDisplayMediator
	}
}
