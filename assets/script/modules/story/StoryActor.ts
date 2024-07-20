import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { UIView } from "../../config/UIConfig"
import StoryProxy from "./StoryProxy"

import StoryMediator from "./StoryMediator"
import StoryGuideMediator from "./StoryGuideMediator"
const { ccclass } = _decorator
@ccclass
export class StoryActor extends BaseActor {
	public listInterests(): [string, IActionHandler][] {
		return [
			[Notification.PLOT_STEP, this.executePlotStep],
			[Notification.LOGIN, this.executeLogin],
		]
	}

	public onRegister() {}

	public executePLOTSTEP(...args: any) {}

	public executeLOGIN(...args: any) {}

	/*---------------------------------[notices]------------------------------------*/
	public executePlotStep(...args: any) {}

	public executeLogin(...args: any) {}

	public storyProxy(): StoryProxy {
		return app.facade.retrieveProxy(StoryProxy.NAME) as StoryProxy
	}

	/*---------------------------------[views]------------------------------------*/
	protected get storyguideMediator(): StoryGuideMediator {
		return app.facade.retrieveMediator(UIView.StoryGuide) as StoryGuideMediator
	}

	protected get storyMediator(): StoryMediator {
		return app.facade.retrieveMediator(UIView.Story) as StoryMediator
	}

	protected get storyGuideMediator(): StoryGuideMediator {
		return app.facade.retrieveMediator(UIView.StoryGuide) as StoryGuideMediator
	}
}
