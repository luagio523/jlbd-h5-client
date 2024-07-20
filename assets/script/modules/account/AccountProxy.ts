import { _decorator } from "cc"
import BaseProxy from "../../mvc/BaseProxy"
import { mvc } from "../../core/mvc/__private"

@mvc.component("AccountProxy")
export default class AccountProxy extends BaseProxy {
	public static NAME = "Account"
}
