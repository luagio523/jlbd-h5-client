import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import LoginProxy from "./LoginProxy"

import CreateRoleMediator from "./CreateRoleMediator"
const { ccclass } = _decorator
@ccclass
export class LoginActor extends BaseActor {
  public listInterests(): [string, IActionHandler][] {
    return [[Notification.CreateRole_View_show, this.executeCreateroleViewShow]]
  }

  public onRegister() {}
  /*---------------------------------[notices]------------------------------------*/
  public executeCreateroleViewShow(...args: any) {
    app.log.logView(args, "LoginActor.executeCreateroleViewShow")
    // app.gui.open("createRoleUI")
  }

  public loginProxy(): LoginProxy {
    return app.facade.retrieveProxy(LoginProxy.NAME) as LoginProxy
  }

  /*---------------------------------[views]------------------------------------*/
}
