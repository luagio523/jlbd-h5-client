import LocalStore from "../storage/LocalStore";

/**
 * 本地路径和window全局处理
 */
export class LocationMgr {
    /**
     * 获取本地值 优先从window全局中获取
     * @param key 
     */
    public getLocalValue(key:string){
		
		let val = this.getGValue(key) //先从 window

		if(val){
			LocalStore.ins().setStringForKey(key,val)
			return val
		}
		val = this.getUrlVal(key) //再从html5
        if(val){
			LocalStore.ins().setStringForKey(key,val)
            return  val
		}

		val = LocalStore.ins().getStringForKey(key,null) //再从本地
		if(val){
			return val
		}
		return null
    }
	
    /**
     * 获取全局值
     * @param key 
     */
    public getGValue(key:string){
        return window[key] 
    }
   
    public  urlParam: any;

    public  init() {
		this.urlParam = {};
		var reg = new RegExp("(.*?)=(.*)")
		var str = window.location.search;
		if (str) {
			var whIndex = str.indexOf("?");
			if (whIndex != -1) {
				var param = str.slice(whIndex + 1).split("&");
				for (var i = 0; i < param.length; i++) {
					let match = param[i].match(reg)
					if (match) {
						this.urlParam[match[1]] = match[2]
					}
				}
			}
		}
    };
    


     /*
     * 获取url参数值，没有返回null
     * 不传递paraUrl参数默认获取当前url
     * */
	public getUrlVal(paraName:string, paraUrl?:any) {
		// if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE)
		// 	return null;
		var url = paraUrl || location.href;
		var whIndex = url.indexOf("?");
		if (whIndex != -1) {
			//let urlPara = "&" + url.split("?")[1];
			var urlPara = "&" + url.slice(whIndex + 1);
			var reg = new RegExp("\&" + paraName + "\=.*?(?:\&|$)");
			var result = reg.exec(urlPara);
			if (result) {
				var value = result[0];
				return value.split("&")[1].split("=")[1];
			}
		}
		return null;
	};
    /*
     * 给Url参数赋值
     * 不传递paraUrl参数默认获取当前url
     * */
	public setUrlVal(paraName:string, paraValue:string, paraUrl?:any) {
		var url = paraUrl || location.href;
		var urlPara = "&" + url.split("?")[1];
		if (url.indexOf("?") == -1) {
			return url += "?" + paraName + "=" + paraValue;
		}
		else {
			var urlPara_1 = url.split("?")[1];
			if (urlPara_1 == "")
				return url += paraName + "=" + paraValue;
			var regParaKV = new RegExp("(?:^|\&)" + paraName + "\=.*?(?:\&|$)");
			var result = regParaKV.exec(urlPara_1);
			if (!result || result[0] == "") {
				return url += "&" + paraName + "=" + paraValue;
			}
			else {
				var oldValue = result[0];
				var regParaKey = new RegExp("\=.*$");
				var newValue = oldValue.replace(regParaKey, "=" + paraValue);
				return url.replace(oldValue, newValue);
			}
		}
	};
    /*
     * 检查url中是否包含某参数
     * 这代码有一个例外就是paraName = "undefined", paraUrl中不含"?"会返回true
     * 相信你不会这么用的 =.=
     * */
	public hasUrlKey(paraName:string, paraUrl?:string) {
		var url = paraUrl || location.href;
		var para = "&" + url.split("?")[1]; //加&是为了把&作为参数名开始=作为参数名结束，防止uid=1&id=2此类误判
		return para.indexOf("&" + paraName + "=") != -1;
	};


    public constructor(){
        this.init()
    }


    static ins():LocationMgr
    {
        if(!this.inst)
        {
            this.inst = new LocationMgr();
        }
        return this.inst;
    }

    private static inst:LocationMgr;

	
}