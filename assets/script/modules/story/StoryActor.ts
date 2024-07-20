import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { UIView } from "../../config/UIConfig"
import { mvc } from "../../core/mvc/__private"
import StoryProxy from "./StoryProxy"
import StoryMediator from "./StoryMediator"
import StoryGuideMediator from "./StoryGuideMediator"

@mvc.component("StoryActor")
export class StoryActor extends BaseActor {
	public listInterests(): [string, IActionHandler][] {
		return [
			[Notification.PLOT_STEP, this.executePLOTSTEP],
			[Notification.LOGIN, this.executeLOGIN],
		]
	}

	public onRegister() {
		// 注册逻辑
	}

	/*---------------------------------[notices]------------------------------------*/

	public executePLOTSTEP(args?: any) {
		// 执行逻辑
	}

	public executeLOGIN(args?: any) {
		// 执行逻辑
	}

	/*---------------------------------[models]------------------------------------*/

	protected get storyProxy(): StoryProxy {
		return app.facade.retrieveProxy(StoryProxy.NAME) as StoryProxy
	}

	/*---------------------------------[views]------------------------------------*/

	protected get storyMediator(): StoryMediator {
		return app.facade.retrieveMediator(UIView.Story) as StoryMediator
	}

	protected get storyguideMediator(): StoryGuideMediator {
		return app.facade.retrieveMediator(UIView.StoryGuide) as StoryGuideMediator
	}
}
