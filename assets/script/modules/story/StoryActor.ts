import { _decorator, log } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import app from "../../App"
import StoryProxy from "./StoryProxy"

import StoryMediator from "./StoryMediator"
import StoryGuideMediator from "./StoryGuideMediator"
import { IActionHandler } from "../../core/mvc/init"
const { ccclass } = _decorator
@ccclass
export class StoryActor extends BaseActor {
  public listInterests(): [string, IActionHandler][] {
    return [[Notification.PLOT_STEP, this.executePlotStep]]
  }

  public onRegister() {}

  public executeLogin(...args: any) {}

  public executePlotStep(...args: any) {
    log("somethings")
  }

  public storyProxy(): StoryProxy {
    return app.facade.retrieveProxy(StoryProxy.NAME) as StoryProxy
  }

  /*---------------------------------[views]------------------------------------*/
}
