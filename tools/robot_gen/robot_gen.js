var SqliteDB = require('./lib/sqlite.js').SqliteDB;
var fs=require('fs');//引入他的模块之后调用读取文件的方法

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

/**
 * 随机一个范围
 * @param {*} min 
 * @param {*} max 
 */
function randomRange(min, max){
    const num = (min + Math.random() * (max - min));
    return Math.round(num);
}

 

let ROBOT_ITEM_TEMPLATE = 
`   ["{name}"] = {
        key = [[{name}]],
        icon = [[{icon}]],
        cath_fish = {catch_fish},
    },
`

let ROBOT_FILE_TEMPLATE = `
local robot_info = {
{0}
}
return robot_info
`

/**
 * 构造robot item
 * @param {*} objects 
 */
function doStructRobot(objects){
    let content = ""
    for(var i = 0; i < objects.length; ++i){
        let data = objects[i]
        if(data.name.search(/\[/) !=-1 || data.name.search(/\]/)!=-1){
            continue;
        }
        let r_data = {
            name : data.name,
            icon : randomRange(1,10),
            catch_fish : randomRange(1,100),
        }
        r_data.name = r_data.name.replace("[","").replace("]","")

        let r_str = ROBOT_ITEM_TEMPLATE.format(r_data)
        content = content + r_str
    }
    return content
}

/**
 * 生成robot文件内容
 * @param {*} content 
 */
function doRobotFileContent(content){
    return ROBOT_FILE_TEMPLATE.format(content)
}

/**
 * 生成机器人
 * @param {数目} num 
 */
function gen_robot(num){
    if(!num) {num = 20}

    var querySql = 'SELECT * FROM bilibili_user_info limit '+num;

    var file = "./lib/nickname.db";
    var sqliteDB = new SqliteDB(file);
    let LUA_TEMP_PATH = "./temp/"

    sqliteDB.queryData(querySql, (objects)=>{
        let content = doStructRobot(objects)
        content = doRobotFileContent(content)
        fs.writeFileSync(LUA_TEMP_PATH+"robot_info.lua",content)
    });
    sqliteDB.close();
}


gen_robot(12000)

console.log("[]".indexOf("["))