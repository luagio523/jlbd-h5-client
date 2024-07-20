import { _decorator } from "cc"
import BaseMediator from "../../mvc/BaseMediator"
import { IActionHandler } from "../../core/mvc/init"
const { ccclass } = _decorator
/**
 * RoleMediator
 */
@ccclass("RoleMediator")
export default class RoleMediator extends BaseMediator {
	public listInterests(): [string, IActionHandler][] {
		return [
			// Add interested events and corresponding handlers here
			// For example: ["Login", this.handleLogin.bind(this)]
		]
	}

	protected onInitialize(): void {
		// Initialization logic
		// For example: set initial UI element states, add event listeners, etc.
	}

	protected onOpen(params: any): void {
		console.log("RoleMediator opened", params)
		// Logic for opening the UI
	}

	protected onClose(): void {
		console.log("RoleMediator closed")
		// Logic for closing the UI
		// For example: clear temporary data, etc.
	}

	protected onDestroy(): void {
		console.log("RoleMediator destroyed")
		// Clean up resources
		// For example: release occupied memory, etc.
	}
}
