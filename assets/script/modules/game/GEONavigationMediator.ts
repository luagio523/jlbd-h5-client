import { _decorator } from "cc"
import BaseMediator from "../../mvc/BaseMediator"
import { IActionHandler } from "../../core/mvc/init"
import { mvc } from "../../core/mvc/__private"
import app from "../../App"
import { UIView } from "../../config/UIConfig"
/**
 * GEONavigationMediator
 */
@mvc.component("GEONavigationMediator")
export default class GEONavigationMediator extends BaseMediator {
	public listInterests(): [string, IActionHandler][] {
		return [
			// 在这里添加感兴趣的事件和对应的处理函数
			// 例如：["Login", this.handleLogin.bind(this)]
		]
	}

	protected onInitialize(): void {
		// 初始化逻辑
		// 例如：设置UI元素的初始状态，添加事件监听器等

		this.viewAdapter.safeClick("closeButton", () => { 
			console.log("claose button clicked")
			app.gui.close(UIView.GEONavigation)
			// app.gui.close(UIView.HeadUpDisplay)
		})	// 点击关闭按钮触发关闭事件

		// this.closeButton = this._frame.getChild("closeButton");
	}

	protected onOpen(params: any): void {
		console.log("GEONavigationMediator opened", params)
		// 打开UI的逻辑
	}

	protected onClose(): void {
		console.log("GEONavigationMediator closed")
		// 关闭UI的逻辑
		// 例如：移除事件监听器,清理临时缓存
	}

	protected onDestroy(): void {
		console.log("GEONavigationMediator destroyed")
		// 清理资源
		// 例如：释放占用的内存等
	}
}
