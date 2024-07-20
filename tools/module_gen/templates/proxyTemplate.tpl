import { _decorator } from "cc";
import BaseProxy from "../../mvc/BaseProxy";
import { mvc } from "../../core/mvc/__private";
/** 
 * <%= name %>Proxy
 * 数据代理 
 */ 
@mvc.component("<%= name %>Proxy")
export default class <%= name %>Proxy extends BaseProxy {
    public static NAME = "<%= name %>"
}