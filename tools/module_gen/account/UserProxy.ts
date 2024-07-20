import { _decorator } from "cc"
import BaseProxy from "../../mvc/BaseProxy"
const { ccclass } = _decorator

@ccclass
export default class UserProxy extends BaseProxy {
	public static NAME = "User"
}
