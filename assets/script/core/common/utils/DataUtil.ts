/**
 * 数据处理工具类
 */

 export class DataUtil {

    /**
     * @ Message转换为普通object
     * @ 服务器传回来的数据是message类型，转换成普通的object可以去掉message自带的属性方法，方便解析
     */
    public static Message2Object(message:any) {
        let str= JSON.stringify(message);
        return JSON.parse(str);
    }
 }