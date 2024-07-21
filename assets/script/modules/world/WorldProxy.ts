import { _decorator } from "cc"
import BaseProxy from "../../mvc/BaseProxy"
import { mvc } from "../../core/mvc/__private"
/**
 * WorldProxy
 * 数据代理
 */
@mvc.component("WorldProxy")
export default class WorldProxy extends BaseProxy {
	public static NAME = "World"
}
