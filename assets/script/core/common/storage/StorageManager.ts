import { tonumber } from "../utils/lstring";
import { CryptoUtils } from "../utils/CryptoUtils";
import { sys } from "cc";

/**
 * 本地存储
 * 基于localStorage
 * 兼容UserDefault
 */
export default class StorageManager{
    // private listeners:any;          //Consts.EventName => cb[]

    public static readonly  Inst = new StorageManager();

    private encryption:boolean = false //for test
    private fjalfjdlajfadsljf:string //mima

    /**
     * 是否加密
     * @param encryption 
     */
    public setEncryption(encryption){
        this.encryption = encryption
    }

    private constructor()
    {
        this.fjalfjdlajfadsljf = "fdanvcxfjdalfjdafdsxa"
        this.localMap = {}
    }

    

    public setStringForKey(key:string,value:string,flush:boolean=true ){
        this.setItem(key,value,flush)
    }

    public getStringForKey(key:string,defval?:any):string{
        return this.getItem(key) || defval
    }

    public setBoolForKey(key:string,value:boolean,flush:boolean=true ){
        this.setItem(key,value+"",flush)
    }

    public getBoolForKey(key:string,defval?:boolean):boolean{
        let item = this.getItem(key)
        if (item == null || item == 'undefined'){
            return defval
        }
        if(item == "false"){
            return false
        }
        if(item == "true"){
            return true
        }
        return false
    }

    public getIntegerForKey(key:string,defval?:number ):number{
        let item = this.getItem(key)
        if (!item){
            return defval
        }
        return tonumber(item)
    }

    public setIntegerForKey(key:string,value:number,flush:boolean=true ){
        this.setItem(key,value+"",flush)
    }

    public getObjectForKey(key: string, defval?: any):any {
        let item = this.getItem(key);
    
        if (!item || item === "NaN") {
            return defval;
        }
      
        // 尝试进行数据解析
        try {
            return JSON.parse(item);
        } catch (error) {
            // 返回默认值defval如果数据解析失败
            return defval;
        }
    }

    public setObjectForKey(key:string,value:any,flush:boolean =true){
        this.setItem(key,value,flush)
    }

    public setItem(key:string,val:string,flush:boolean=true ){
        if(flush){
            this.flushItem(key,val)
        }else{
            this.localMap[key] = val
            this.setDirty()
        }
    }

    private _dirty:boolean = false

     /**
     * 设置数据脏
     * @param force 
     */
    public setDirty(force: boolean = false) {
        if (force) {
            this.flushItems()
            return
        }
        if (this._dirty) {
            return
        }
        this._dirty = true

        setTimeout(() => {
            this.flushItems();
            this._dirty = false;
        }, StorageManager.MAX_DELAY_SAVE_TIME);
    }

    public static MAX_DELAY_SAVE_TIME:number = 25000 // 25秒

    private localMap:any = null
    /**
     * 写入本地数据
     */
	private flushItems(){
        let val = null
		for (const key in this.localMap) {//每个鱼更新
			val = this.localMap[key]
            this.flushItem(key,val)
        }
        this.localMap = {}
    }
    

    private flushItem(key: string, val: string | boolean | number | object) {
        let valString: string;
    
        // 将非string类型的值转换为string
        if (typeof val === 'string') {
            valString = val;
        } else if (typeof val === 'number' || typeof val === 'boolean') {
            valString = val.toString();
        } else if (typeof val === 'object') {
            valString = JSON.stringify(val);
        }
      
        // 进行加密
        if (this.encryption) {
            valString = CryptoUtils.aesEncrypt(valString, this.fjalfjdlajfadsljf);
            
            sys.localStorage.setItem(key, valString);
            

        }else{
            sys.localStorage.setItem(key, valString);
        }
    
        // 存入localStorage
        
    }

    public getItem(key: string): string {
        let item: string = sys.localStorage.getItem(key);
      
        if (!item || item === 'NaN') {
            return null;
        }
    
        if (this.encryption) {
            try {
                item = CryptoUtils.aesDecrypt(item, this.fjalfjdlajfadsljf);
            } catch (error) {
                // 在解密操作失败时返回null
                return null;
            }
        }
        return item;
    }

    // var data = 'Hello, this is a secret message!';
// var key = 'Password!';
// var encrypted = aesEncrypt(data, key);
// var decrypted = aesDecrypt(encrypted, key);

// cc.log('Plain text: ' + data);
// cc.log('Encrypted text: ' + encrypted);
// cc.log('Decrypted text: ' + decrypted);


    
}

