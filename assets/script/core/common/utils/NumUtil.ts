import { ArrayUtils } from "./ArrayUtils";

/**数字工具类 */
export class NumUtils {

    /**
     * 在数字范围内，随机一个固定长度的纯数字组成的数组
     */
    public static NumArrayInRange(start: number, end: number, length: number) {
        let arr = [];
        for (let i = start; i < end; i++) {
            arr[arr.length] = i;
        }
        ArrayUtils.Rush(arr, 100);
        let maxLen = Math.min(arr.length, length);
        arr.length = maxLen;
        return arr;
    }

    /**
     * 数字转换为：数字+文字
     */
    public static numChar(num: number, len: number = 1): string {
        var turnNum: string = num.toString();
        let strLen = turnNum.split(".")[0].length;
        if (strLen >= 9) {
            return this._numChar(num/100000000, len) + "亿";
        } else if (strLen < 9 && strLen >= 5) {
            return this._numChar(num/10000, len) + "万";
        }
        return turnNum;
    }

    private static _numChar(num, len) {
        let str = num.toString();
        let index = str.indexOf(".");
        if(len <= 0 || index == -1) {
            return str;
        }
        str = str.slice(0, index+len+1);
        return str;
    }


    /**
     * 电话号码首3位检查
     */
    public static checkMobile(numStr: String): Boolean {
        switch (numStr) {
            case "130":
            case "131":
            case "132":
            case "133":
            case "134":
            case "135":
            case "136":
            case "137":
            case "138":
            case "139":
            case "147":
            case "150":
            case "151":
            case "152":
            case "153":
            case "155":
            case "156":
            case "157":
            case "158":
            case "159":
            case "166":
            case "173":
            case "175":
            case "176":
            case "178":
            case "180":
            case "181":
            case "182":
            case "183":
            case "184":
            case "185":
            case "186":
            case "187":
            case "188":
            case "189":
            case "198":
            case "199":
                return true;
        }
        return false;
    }
    /**   
    * 字符串转换成数字
    */
    public static charNum(char: string, unit: string): number {
        char = char.replace(unit, "");
        char = char.replace("万", "0000");
        char = char.replace("亿", "00000000");
        let num = parseInt(char);
        return num;
    }

    /**
     * 数字转固定长度字符串
     */
    public static num2lengthChar(num: number, len: number): string {
        let str = num + "";
        while (str.length < len) {
            str = "0" + str
        }
        return str;
    }

    /**数字固定在一个范围内 */
    public static numInRange(num: number, min: number, max: number): number {
        if (num <= min)
            return min;
        if (num >= max)
            return max;
        return num;
    }

    /**poker value */
    public static pokerValue(index: number) {
        let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        return arr[index];
    }
    /**longzhu value */
    public static longzhuValue(index: number) {
        let arr = [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7];
        return arr[index]
    }

}