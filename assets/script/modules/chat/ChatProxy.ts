import { _decorator } from "cc"
import BaseProxy from "../../mvc/BaseProxy"
import { mvc } from "../../core/mvc/__private"
/**
 * ChatProxy
 * 数据代理
 */
@mvc.component("ChatProxy")
export default class ChatProxy extends BaseProxy {
	public static NAME = "Chat"
}
