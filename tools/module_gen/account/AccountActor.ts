import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { UIView } from "../../config/UIConfig"

import AccountProxy from "./AccountProxy"
import UserProxy from "./UserProxy"

import LoginMediator from "./LoginMediator"

const { ccclass } = _decorator
@ccclass
export class AccountActor extends BaseActor {
  public listInterests(): [string, IActionHandler][] {
    return [
      [Notification.Login_View_Show, this.executeLogin_View_Show],
      [Notification.Logout_View_Hide, this.executeLogout_View_Hide],
    ]
  }

  public onRegister() {
    // 注册逻辑
  }

  /*---------------------------------[notices]------------------------------------*/

  public executeLogin_View_Show(...args: any) {
    // 执行逻辑
  }

  public executeLogout_View_Hide(...args: any) {
    // 执行逻辑
  }

  /*---------------------------------[models]------------------------------------*/

  protected get accountProxy(): AccountProxy {
    return app.facade.retrieveProxy(AccountProxy.NAME) as AccountProxy
  }

  protected get userProxy(): UserProxy {
    return app.facade.retrieveProxy(UserProxy.NAME) as UserProxy
  }

  /*---------------------------------[views]------------------------------------*/

  protected get loginMediator(): LoginMediator {
    return app.facade.retrieveMediator(UIView.Login) as LoginMediator
  }
}
