import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { UIView } from "../../config/UIConfig"

import RoleProxy from "./RoleProxy"

import CreateRoleMediator from "./CreateRoleMediator"
import { mvc } from "../../core/mvc/__private"
import RoleCache from "./RoleCache"
// -- 遵守开发约定
// -- 1. 模块之间必须通过事件来做交互，主要是界面的处理
// -- 2. 只有模块中的 Actor 层才能调用 view 层的接口，其他层如 model、service、handler 等都不能
// -- 3. 模块之间可以互相调用之间的 model 层和 service 层的公开接口
// -- 4. 模块 view 层，没有能力直接调用其他
@mvc.component("RoleActor")
export class RoleActor extends BaseActor {
	public listInterests(): [string, IActionHandler][] {
		return [
			[Notification.CREATEROLE_VIEW_SHOW, this.executeCreateroleViewShow],
			[Notification.CREATE_ROLE, this.executeCreateRole],
		]
	}

	public onRegister() {
		// 注册逻辑
	}

	/*---------------------------------[notices]------------------------------------*/
	public executeCreateroleViewShow(...args: any) {
		// 执行逻辑
		app.log.logView(args, "LoginActor.executeCreateroleViewShow")
		app.gui.open(UIView.CreateRole,{name:"hhh"})
	}

	public executeCreateRole(name:string) {
		// 执行逻辑
		console.log("RoleActor executeCreateRole",name)
		const role = this.roleProxy.createRole(name)
		let cache = new RoleCache(this.roleProxy)
		// app.cache.registerCache(cache.getKey(), cache,RoleCache.cacheInterval)
		cache.save(true)
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
