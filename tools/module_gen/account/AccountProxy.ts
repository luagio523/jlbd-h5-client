import { _decorator } from "cc"
import BaseProxy from "../../mvc/BaseProxy"
const { ccclass } = _decorator

@ccclass
export default class AccountProxy extends BaseProxy {
	public static NAME = "Account"
}
