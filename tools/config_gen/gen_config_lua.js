

var fs=require('fs');//引入他的模块之后调用读取文件的方法

let CONFIG_PATH = "../../assets/resources/config/"

let LUA_TEMP_PATH = "./temp/"
/**
 * 读取一个json配置文件
 * @param {*} fileName 
 */
function readJsonConf(fileName){
    let fileData = fs.readFileSync(CONFIG_PATH+fileName+".json",'utf-8')
    
    return fileData
}

/**
 * 将json str 转化为lua str
 * @param {*} jsonConf 
 */
function jsonToLua(fileData){

    fileData = fileData.replace(/\[/g,"{")
    fileData = fileData.replace(/\]/g,"}")
    fileData = fileData.replace(/:/g,"=")

    fileData = fileData.replace(/"(\d+)"/g,(match,p1,offset, string) => {
        return "["+p1+"] ";
    })

    fileData = fileData.replace(/"(.*?)"\s*=/g,(match,p1,offset, string) => {
        return p1+" =";
    })
    return fileData
}

/**
 * 根据信息将json配置文件写成lua
 * @param {*} fileInfo 
 */
function dealJsonConfToLua(fileInfo){
    let fileData = readJsonConf(fileInfo.name)

    if(fileInfo.dels || fileInfo.adds){
        let conf = JSON.parse(fileData)

        for (const key in conf) {
            const element = conf[key];
            if(fileInfo.dels.length>0){
                fileInfo.dels.forEach(key => {
                    delete element[key]
                });
            } 
            if(fileInfo.adds.length>0){
                fileInfo.adds.forEach(key => {
                    element[key] = 0
                });
            } 
        }

        fileData = JSON.stringify(conf,null, '\t')
    }


    let luaStr = jsonToLua(fileData)
    
    luaStr = "local "+fileInfo.name +" = \n"+luaStr+" \nreturn "+fileInfo.name

    fs.writeFileSync(LUA_TEMP_PATH+fileInfo.name+".lua",luaStr)
    
}

//需要处理的文件 目前就这几个
//dels表示要删除的字段 ,adds表示要增加的 
let fileConfigs = [
    {
        name:"fish",
        dels:["deadEffect","benefitGroup","icon","dieAnim","hitAnim","moveAnim","qxxsAnim","qxxxAnim","goldDropType"],
        adds:["sendMarquee"]
    },
    {
        name:"fish_group"
        
    },
    // {
    //     name:"fish_path"
        
    // },
    // {
    //     name:"fish_refresh"
        
    // },
    // {
    //     name:"fish_strikes_refresh"
        
    // },
    // {
    //     name:"fish_refresh_room0"
    // },
    // {
    //     name:"fish_refresh_room1"
    // },
    // {
    //     name:"fish_refresh_room2"
    // },
    // {
    //     name:"fish_refresh_room3"
    // },
    // {
    //     name:"fish_refresh_room4"
    // },
    // {
    //     name:"fish_refresh_room5"
    // },
    // {
    //     name:"fish_refresh_room6"
    // },
    // {
    //     name:"fish_refresh_room7"
    // },
    // {
    //     name:"fish_refresh_room8"
    // },
    // {
    //     name:"fish_refresh_room9"
    // },
    // {
    //     name:"fish_refresh_room11"
    // },
    // {
    //     name:"fish_refresh_room12"
    // },
    // {
    //     name:"fish_refresh_room13"
    // },
    // {
    //     name:"fish_refresh_room100"
    // },
]

function genRun(){
    fileConfigs.forEach((element)=>{
        dealJsonConfToLua(element)
    })
}

genRun()
