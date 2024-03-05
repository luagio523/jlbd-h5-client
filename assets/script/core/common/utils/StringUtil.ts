export class StringUtil {


    /*
  "{0}"  替换 format
*/
    public static strfmt(fmt: string, ...args: any[]) {
        return fmt.replace(/\{(\d+)\}/g, (match: string, argIndex: number) => {
            return args[argIndex] || match;
        });
    }

    public static  isBlank(value, need_trim) {
        if ((typeof(need_trim) !== "undefined") && (need_trim !== null) && (need_trim !== true)) {
            need_trim = false;
        }
        
        if (need_trim) {
            if ((value !== null) && (typeof(value) !== "undefined") && (typeof(value) == "string")) {
                value = StringUtil.trim(value);
            }
        }
            
        if (value === "" || value === null || typeof(value) === "undefined") {
            return true;
        } else {
            return false;
        }
    }
    
    public static  isNotBlank(value, need_trim) {
        return !StringUtil.isBlank(value, need_trim);
    }
    
    public static  trim(value) {
        return value.replace(/^\s+|\s+$/g,"");
    }
    
    public static  ltrim(value) {
        return value.replace(/^\s+/,"");
    }
    
    public static   rtrim(value) {
        return value.replace(/\s+$/,"");
    }


    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    public static isChinese(str) {
        var reg = /^[\u4E00-\u9FA5]+$/;
        if (!reg.test(str)) {
            return true;
        }
        return false;
    };


      /**
     * 获取字符串的字节长度
     * 一个中文算2两个字节
     * @param str
     * @return
     */
    public static strByteLen(str) {
        var byteLen = 0;
        var strLen = str.length;
        for (var i = 0; i < strLen; i++) {
            byteLen += str.charCodeAt(i) >= 0x7F ? 2 : 1;
        }
        return byteLen;
    };

     /**
     * 补齐字符串
     * 因为这里使用的是字节长度（一个中文算2个字节）
     * 所以指定的长度是指字节长度，用来填补的字符按一个字节算
     * 如果填补的字符使用中文那么会导致结果不正确，但这里没有对填补字符做检测
     * @param str 源字符串
     * @param length 指定的字节长度
     * @param char 填补的字符
     * @param ignoreHtml 是否忽略HTML代码，默认为true
     * @return
     *
     */
    public static complementByChar(str, length, char?: string, ignoreHtml?: boolean) {
        if (char === void 0) { char = " "; }
        if (ignoreHtml === void 0) { ignoreHtml = true; }
        var byteLen = this.strByteLen(ignoreHtml ? str.replace(StringUtil.HTML, "") : str);
        return str + this.repeatStr(char, length - byteLen);
    };
    /**
     * 重复指定字符串count次
     * @param str
     * @param count
     * @return
     *
     */
    public static repeatStr(str, count) {
        var s = "";
        for (var i = 0; i < count; i++) {
            s += str;
        }
        return s;
    };

    public static HTML = /<[^>]+>/g;


    public static ToSingleHex(value: number): string {
        let str = value.toString(16)
        if (str.length == 1) {
            return "0" + str
        }
        return str
    }
    public static numTenToChinese(number):string
    {
        switch(number)
        {
            case 0:return '零'; 
            case 1:return '一'; 
            case 2:return '二'; 
            case 3:return '三'; 
            case 4:return '四'; 
            case 5:return '五'; 
            case 6:return '六'; 
            case 7:return '七'; 
            case 8:return '八'; 
            case 9:return '九';
            case 10:return '十';
        }
    }

    public static numberToChinese(num: number): string{
        let chinese: string
        if(num<=10){
           chinese = StringUtil.numTenToChinese(num)
        }else if(num < 100){
            let gw = num%10
            let sw = num/10
            if(gw == 0){
                chinese = StringUtil.numTenToChinese(Math.floor(sw)) + '十'
            }else{
                if(sw < 2)
                {
                    chinese = '十' + StringUtil.numTenToChinese(gw)
                }else
                {
                    chinese = StringUtil.numTenToChinese(Math.floor(sw)) + '十' + StringUtil.numTenToChinese(gw)
                }
            }  
        }
        return chinese
    }

    /**
     * 字符串转固定长度字符串
     */
    public static lengthChar(str:string, len:number):string {
        while(str.length < len) {
            str = "0" + str
        }
        return str;
    }

}