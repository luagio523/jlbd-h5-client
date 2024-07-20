import { _decorator } from "cc"
import BaseMediator from "../../mvc/BaseMediator"
import { IActionHandler } from "../../core/mvc/init"
import { mvc } from "../../core/mvc/__private"
/**
 * StoryGuideMediator
 */
@mvc.component("StoryGuideMediator")
export default class StoryGuideMediator extends BaseMediator {
	public listInterests(): [string, IActionHandler][] {
		return [
			// 在这里添加感兴趣的事件和对应的处理函数
			// 例如：["Login", this.handleLogin.bind(this)]
		]
	}

	protected onInitialize(): void {
		// 初始化逻辑
		// 例如：设置UI元素的初始状态，添加事件监听器等
	}

	protected onOpen(params: any): void {
		console.log("StoryGuideMediator opened", params)
		// 打开UI的逻辑
	}

	protected onClose(): void {
		console.log("StoryGuideMediator closed")
		// 关闭UI的逻辑
		// 例如：移除事件监听器,清理临时缓存
	}

	protected onDestroy(): void {
		console.log("StoryGuideMediator destroyed")
		// 清理资源
		// 例如：释放占用的内存等
	}
}
