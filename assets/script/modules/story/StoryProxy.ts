import { _decorator } from "cc"
import BaseProxy from "../../mvc/BaseProxy"
import { mvc } from "../../core/mvc/__private"
/**
 * StoryProxy
 * 数据代理
 */
@mvc.component("StoryProxy")
export default class StoryProxy extends BaseProxy {
	public static NAME = "Story"
}
