let fs = require("fs");//获取文件系统模块，负责读写文件
let path = require("path");//工具模块，处理文件路径的小工具
let JSZIP = require("jszip");
let zip = new JSZIP();

//读取目录及文件
function readDir(obj, nowPath) {
    let files = fs.readdirSync(nowPath);//读取目录中的所有文件及文件夹（同步操作）
    files.forEach(function (fileName, index) {//遍历检测目录中的文件
        console.log(fileName, index);//打印当前读取的文件名
        let fillPath = nowPath + "/" + fileName;
        let file = fs.statSync(fillPath);//获取一个文件的属性
        if (file.isDirectory()) {//如果是目录的话，继续查询
            let dirlist = zip.folder(fileName);//压缩对象中生成该目录
            readDir(dirlist, fillPath);//重新检索目录文件
        } else {
            if(fileName.endsWith(".json") || fileName.endsWith(".proto"))
            obj.file(fileName, fs.readFileSync(fillPath));//压缩目录添加文件
        }
    });
}

//开始压缩文件
function startZIP(configDir,targetDir,name) {
    // var currPath = rootPath;//文件的绝对路径 当前当前js所在的绝对路径
    // var targetDir = path.join(currPath, "configs");
    readDir(zip, configDir);
    zip.generateAsync({//设置压缩格式，开始打包
        type: "nodebuffer",//nodejs用
        compression: "DEFLATE",//压缩算法
        compressionOptions: {//压缩级别
            level: 9
        }
    }).then(function (content) {
        fs.writeFileSync(targetDir + name, content, "utf-8");//将打包的内容写入 当前目录下的 result.zip中
    });
}


let CONFIG_PATH = "../../assets/resources/config/"
// let TARGET_DIR = CONFIG_PATH
let CONFIG_TARGET_DIR = "../../assets/resources/config/"
let CONFIG_FILE_NAME = "cfg.bin"

let PROTO_PATH = "../../assets/resources/pb/"
let PROTO_FILE_NAME = "pb.bin"

startZIP(CONFIG_PATH,CONFIG_PATH,CONFIG_FILE_NAME); //处理配置文件

startZIP(PROTO_PATH,PROTO_PATH,PROTO_FILE_NAME); //处理协议文件