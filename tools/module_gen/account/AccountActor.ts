import { _decorator } from "cc"
import { BaseActor } from "../../mvc/BaseActor"
import { Notification } from "../../mvc/Notification"
import { IActionHandler } from "../../core/mvc/init"
import app from "../../App"
import { UIView } from "../../config/UIConfig"

import AccountProxy from "./AccountProxy"
import UserProxy from "./UserProxy"
import RoleProxy from "./RoleProxy"

import LoginMediator from "./LoginMediator"
import RoleMediator from "./RoleMediator"

const { ccclass } = _decorator
@ccclass
export class AccountActor extends BaseActor {
	public listInterests(): [string, IActionHandler][] {
		return [
			[Notification.Login_View_Show, this.executeLogin_View_Show],
			[Notification.Logout_View_Show, this.executeLogout_View_Show],
			[Notification.Role_View_Show, this.executeRole_View_Show],
			[Notification.User_View_Show, this.executeUser_View_Show],
			[Notification.User_View_Hide, this.executeUser_View_Hide],
			[
				Notification.User_View_Show_Role_List,
				this.executeUser_View_Show_Role_List,
			],
			[
				Notification.User_View_Show_Role_Detail,
				this.executeUser_View_Show_Role_Detail,
			],
			[
				Notification.User_View_Show_Role_Create,
				this.executeUser_View_Show_Role_Create,
			],
			[
				Notification.User_View_Show_Role_Edit,
				this.executeUser_View_Show_Role_Edit,
			],
			[
				Notification.User_View_Show_Role_Delete,
				this.executeUser_View_Show_Role_Delete,
			],
			[
				Notification.User_View_Show_Role_Save,
				this.executeUser_View_Show_Role_Save,
			],
			[
				Notification.User_View_Show_Role_Cancel,
				this.executeUser_View_Show_Role_Cancel,
			],
			[
				Notification.User_View_Show_Role_Delete_Confirm,
				this.executeUser_View_Show_Role_Delete_Confirm,
			],
			[
				Notification.User_View_Show_Role_Delete_Cancel,
				this.executeUser_View_Show_Role_Delete_Cancel,
			],
			[
				Notification.User_View_Show_Role_Delete_Confirm_OK,
				this.executeUser_View_Show_Role_Delete_Confirm_OK,
			],
			[
				Notification.User_View_Show_Role_Delete_Confirm_Cancel,
				this.executeUser_View_Show_Role_Delete_Confirm_Cancel,
			],
			[
				Notification.User_View_Show_Role_Delete_Confirm_OK_OK,
				this.executeUser_View_Show_Role_Delete_Confirm_OK_OK,
			],
			[
				Notification.User_View_Show_Role_Delete_Confirm_OK_Cancel,
				this.executeUser_View_Show_Role_Delete_Confirm_OK_Cancel,
			],
			[
				Notification.User_View_Show_Role_Delete_Confirm_Cancel_OK,
				this.executeUser_View_Show_Role_Delete_Confirm_Cancel_OK,
			],
			[
				Notification.User_View_Show_Role_Delete_Confirm_Cancel_Cancel,
				this.executeUser_View_Show_Role_Delete_Confirm_Cancel_Cancel,
			],
			[Notification.User_View_Show_Role, this.executeUser_View_Show_Role],
		]
	}

	public onRegister() {
		// 注册逻辑
	}

	/*---------------------------------[notices]------------------------------------*/
	public executeUser_View_Hide(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_List(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Detail(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Create(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Edit(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Delete(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Save(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Cancel(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Delete_Confirm(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Delete_Cancel(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Delete_Confirm_OK(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Delete_Confirm_Cancel(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Delete_Confirm_OK_OK(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Delete_Confirm_OK_Cancel(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Delete_Confirm_Cancel_OK(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role_Delete_Confirm_Cancel_Cancel(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show_Role(...args: any) {
		// 执行逻辑
	}

	public executeRole_View_Show(...args: any) {
		// 执行逻辑
	}

	public executeUser_View_Show(...args: any) {
		// 执行逻辑
	}

	public executeLogout_View_Show(...args: any) {
		// 执行逻辑
	}

	public executeLogin_View_Show(...args: any) {
		// 执行逻辑
	}

	/*---------------------------------[models]------------------------------------*/

	protected get accountProxy(): AccountProxy {
		return app.facade.retrieveProxy(AccountProxy.NAME) as AccountProxy
	}

	protected get userProxy(): UserProxy {
		return app.facade.retrieveProxy(UserProxy.NAME) as UserProxy
	}

	protected get roleProxy(): RoleProxy {
		return app.facade.retrieveProxy(RoleProxy.NAME) as RoleProxy
	}

	/*---------------------------------[views]------------------------------------*/

	protected get loginMediator(): LoginMediator {
		return app.facade.retrieveMediator(UIView.Login) as LoginMediator
	}

	protected get roleMediator(): RoleMediator {
		return app.facade.retrieveMediator(UIView.Role) as RoleMediator
	}
}
