import { Asset, BufferAsset, JsonAsset, error, resources } from "cc";

/**
 * 配置文件管理
 */
export default class ConfigMgr{
    private static instance: ConfigMgr;
    public static getInstance(): ConfigMgr {
        if (!ConfigMgr.instance) {
            ConfigMgr.instance = new ConfigMgr();
        }
        return ConfigMgr.instance;
    }


     /**
     * 加载zip文件
     * @param url 
     * @param callback 
     */
     public async loadZip(url:string):Promise<any> {

        return new Promise(async (resolve, reject) => {
            resources.load(url, BufferAsset, async (error: Error | null, asset: BufferAsset) => {
                if (error) return reject(error);
        
                var zip = await JSZip.loadAsync(asset.buffer());
                resolve(zip);
            })

        });
        
    }


     /**
     * zip转字典
     * @param zip 
     */
     public async zip2dic(zip:any,waitList:Array<string>=null):Promise<any>  {

        return new Promise(async (resolve, reject) => {
            let fileList = zip.files;
            let configMap = {}
            let notWaitList = []
            for(let filename in fileList){
                if(waitList && waitList.indexOf(filename)!= -1){
                    let data = await zip.file(filename).async('string')
                    configMap[filename.substring(0,filename.indexOf("."))] = data

                    // console.log("await succ ",filename)
                }else{
                    notWaitList.push(filename)
                }
            }

            for(let filename of notWaitList){
                 zip.file(filename).async('string').then(data=>{
                    configMap[filename.substring(0,filename.indexOf("."))] = data
                })
            }

            resolve(configMap)

        });
     
    }

     /**
     * 加载配置文件
     * 同步的方式
     */
    public async initCfg(path:string,zipMode:boolean = true):Promise<any> {
        if(this.configTextMap) return  new Promise(async (resolve, reject) => {
            resolve(this.configTextMap);
        });

        console.log("start init cfg ")

        if(zipMode){
            return new Promise(async (resolve, reject) => {
                let zip = await this.loadZip("resources/"+path+"cfg.bin")
                this.configTextMap = await this.zip2dic(zip,["animation.json","battle.json"]) //数组中的表示等待处理完
                resolve(this.configTextMap);
            });

        }else{
            return  resources.loadDir(path)
        }
    }

    //获取配置文件名
    private getConfigFile(name:string):string{
        return "config/"+name
    }


     ///////////////////////////业务耦合////////////////////////////////////////



     private constructor()
     {
     }
 
   

     private configTextMap:any = null
     private configMap:any = {}
 
     /**
      * 获取配置
      * 配置必须在游戏前加载
      */
     public  get(name:string):any{

        let cfg = this.configMap[name]
        if(cfg){
            return cfg
        }
        
        if(this.configTextMap){
            let cfgStr = this.configTextMap[name]
            if(cfgStr){
                cfg = JSON.parse(cfgStr)
                this.configMap[name] = cfg
                delete this.configTextMap[name]
                return cfg
            }
        }

         let configFileName = this.getConfigFile(name)
         let res = resources.get(configFileName, JsonAsset);
         if(!res){
            error("you should load config at first",configFileName)
             return {}
         }
         return res.json
     }
 
     //同步获取
     public  async getAwait(name:string):Promise<any>{
         let configFileName = this.getConfigFile(name)
        return resources.load(configFileName,JsonAsset)
     }
 
}