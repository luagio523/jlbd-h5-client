import { _decorator } from "cc"
import BaseMediator from "../../mvc/BaseMediator"
import { IActionHandler } from "../../core/mvc/init"
import { mvc } from "../../core/mvc/__private"
import { GComponent } from "fairygui-cc"
import { Joystick } from "./Joystick"
/**
 * HeadUpDisplayMediator
 */
@mvc.component("HeadUpDisplayMediator")
export default class HeadUpDisplayMediator extends BaseMediator {
	private joystick: Joystick = null


	public listInterests(): [string, IActionHandler][] {
		return [
			// 在这里添加感兴趣的事件和对应的处理函数
			// 例如：["Login", this.handleLogin.bind(this)]
		]
	}

	protected onInitialize(): void {
		console.log("HeadUpDisplayMediator onInitialize")
		// 初始化逻辑
		// 例如：设置UI元素的初始状态，添加事件监听器等
		const cptHand = this.viewAdapter.findChild<GComponent>("cpt_hand");
		this.joystick = new Joystick();
		this.joystick.injectUI(cptHand)
	}

	protected onOpen(params: any): void {
		console.log("HeadUpDisplayMediator opened", params)
		// 打开UI的逻辑
	}

	protected onClose(): void {
		console.log("HeadUpDisplayMediator closed")
		// 关闭UI的逻辑
		// 例如：移除事件监听器,清理临时缓存
	}

	protected onDestroy(): void {
		console.log("HeadUpDisplayMediator destroyed")
		// 清理资源
		// 例如：释放占用的内存等
	}
}
