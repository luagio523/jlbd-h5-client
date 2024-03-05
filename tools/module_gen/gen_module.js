/**
 * node环境
 */

var template = require('./lib/template.js');
var fs=require('fs');//引入他的模块之后调用读取文件的方法


let MODULE_ROOT_PATH = "../../assets/script/modules/" //模块路径
let GAME_MVC_ROOT_PATH = "../../assets/script/mvc/" //GameEvent路径
/**
 * 将第一个字母小写
 * @param {} str 
 */
function firstLower(str){
    return str.charAt(0).toLocaleLowerCase()+str.substr(1)
}

/**
 * 格式化
 * @param {} fmt 
 * @param  {...any} args 
 */
function strfmt(fmt, ...args) {
    return fmt.replace(/\{(\d+)\}/g, (match, argIndex) => {
        return args[argIndex] || match;
    });
}

/**
 * 模板处理
 * @param {*} tpl 
 * @param {*} tpldt 
 */
function handlerTemplate(tpl,tpldt){
    return template(tpl, tpldt).replace(/@@/g,"\n")
}


/**
 * 处理mvc每一个类型
 * @param {*} module 模块名
 * @param {*} item   类型名
 * @param {*} tpldt 模板数据
 */
function handlerItem(module,item,tpldt,overide){
    var tpl = fs.readFileSync('templates/Template'+item+".tpl",'utf-8');
    let ret = handlerTemplate(tpl,tpldt)
    let modulePath = MODULE_ROOT_PATH+module.toLocaleLowerCase()+"/"
    let isExist = fs.existsSync(modulePath)
    if(!isExist){
        fs.mkdirSync(modulePath)
    }
    let moduleFile = modulePath + module+item+".ts"

    if(!overide && fs.existsSync(moduleFile)){
        console.log(moduleFile+" is exist,will not write")
        return false
    }

    fs.writeFileSync(moduleFile,ret)
    console.log("write "+moduleFile)
    return true
}


//处理model
function handlerModel(module){
    handlerItem(module,"Proxy",{Template: module}) 
}

//处理service
function handlerService(module){
    handlerItem(module,"Service",{Template: module}) 
}

//处理controller
function handlerController(module,events,views){
    let modulePath = MODULE_ROOT_PATH+module.toLocaleLowerCase()+"/"
    let moduleFile = modulePath + module+"Controller"+".ts"
    let isExist = fs.existsSync(moduleFile)
    let fileData = null
    if(isExist){
        fileData = fs.readFileSync(moduleFile,'utf-8')
    }
    
    let lmodule = module.toLocaleLowerCase() //小写
    let ctlpdt = {Template: module,Template2: lmodule}
    ctlpdt.evtlist = []

    ctlpdt.importlist = []

    events.forEach(element => {
        let rmethod =`public  notice{0}(notification:any){

    } `

        rmethod = strfmt(rmethod,element.replace(/_/g,""))
        let method = "notice"+element.replace(/_/g,"")+"(notification:any)"
        let method2 = "notice"+element.replace(/_/g,"")+"(notification: any)"
        if(!isExist || fileData.indexOf(method) ==  -1 && fileData.indexOf(method2) ==  -1){ //当文件不存在　或者　文件内容不包含
            ctlpdt.evtlist.push({method:rmethod})
        }
    });
    ctlpdt.viewlist = []
    views.forEach(element => {
        let rmethod =`protected  get {0}View():{1}View{ 
        return ns.views.{0}
    } `

        rmethod = strfmt(rmethod,firstLower(element),element)

        let method = "get " +firstLower(element)+"View():"+element+"View"
        if(!isExist || fileData.indexOf(method) ==  -1){　//当文件不存在　或者　文件内容不包含
            ctlpdt.viewlist.push({method:rmethod})
            ctlpdt.importlist.push({name:element+"View"})
        }
    });
    
    

    if(!isExist){
        handlerItem(module,"Controller",ctlpdt)
    }else{　//处理　增量更新
        if(ctlpdt.evtlist.length > 0){
            fileData = CreateAddEventMethod(fileData,"notices",{methodlist:ctlpdt.evtlist}) //创建　evt的增量
        }
        if(ctlpdt.viewlist.length > 0 ){
           
            fileData = CreateImport(fileData,ctlpdt.importlist)
            fileData = CreateAddEventMethod(fileData,"views",{methodlist:ctlpdt.viewlist}) //创建　views的增量
        }
        if(ctlpdt.evtlist.length > 0 || ctlpdt.viewlist.length > 0){ //有增量需要重新写入
            fs.writeFileSync(moduleFile,fileData)
            console.log("update write "+moduleFile)
        }else{
            console.log(moduleFile+" is exist and no need update")
        }
        
    }
}

let CLASS_TAG = "const {ccclass} = cc._decorator;"
/**
 * 创建导入
 * @param {} fileData 
 * @param {*} importlist 
 */
function CreateImport(fileData,importlist){
    if(!fileData ||!importlist) {
        console.log("CreateImport params error,plz check")
        return
    }
    var tpl = fs.readFileSync('templates/Template'+"Import"+".tpl",'utf-8');
    let tpldt= {}
    tpldt.importlist=importlist
    
    let ret = handlerTemplate(tpl,tpldt)
    ret = ret + CLASS_TAG
    fileData = fileData.replace(CLASS_TAG,ret)
    return fileData
}



let METHOD_TAG = "/*---------------------------------[tag]------------------------------------*/"
/**
 * 创建增加的事件通知函数
 * @param {} fileData 
 * @param {*} tag 
 * @param {*} tpldt 
 */
function CreateAddEventMethod(fileData,tag,tpldt){
    if(!fileData || !tag || !tpldt) {
        console.log("CreateAddEventMethod params error,plz check")
        return
    }
    var tpl = fs.readFileSync('templates/Template'+"AddMethod"+".tpl",'utf-8');
    let ret = handlerTemplate(tpl,tpldt)
    methodTag = METHOD_TAG.replace("tag",tag)
    ret = methodTag + ret

    fileData = fileData.replace(methodTag,ret)

    return fileData
}


//处理视图
function handlerView(views,module){
    views.forEach(element => {

        let tpldt = {module:module,module2:firstLower(module),Template: element,Template2:firstLower(element)}

        var tpl = fs.readFileSync('templates/Template'+"Mediator"+".tpl",'utf-8');

        let ret = handlerTemplate(tpl,tpldt)
    
        let modulePath = MODULE_ROOT_PATH+module.toLocaleLowerCase()+"/"
    
        let isExist = fs.existsSync(modulePath)
        if(!isExist){
            fs.mkdirSync(modulePath)
        }
        
        let moduleFile = modulePath + element+"Mediator"+".ts"

        if( fs.existsSync(moduleFile)){
            console.log(moduleFile+" is exist,will not write")
            return 
        }
    
        fs.writeFileSync(moduleFile,ret)
        console.log("write "+moduleFile)
    });
}

//处理事件
function handlerEvent(module,events){
    let etlpdt = {Template:module}
    etlpdt.evtlist = []

    events.forEach(element => {
        etlpdt.evtlist.push({name:element})
    });

    handlerItem(module,"Event",etlpdt,true)

}

//处理总GameEvent
function handlerTotalEvent(events){
    let tpldt = {}
    tpldt.evtlist = []
    let temp = {}
    events.forEach(element => {
        if(!temp[element]){
            tpldt.evtlist.push({name:element})
        }
        temp[element] = 1
    });

    var tpl = fs.readFileSync('templates/GameEvent.tpl','utf-8');

    let ret = handlerTemplate(tpl,tpldt)

    let gameEvtPath = GAME_MVC_ROOT_PATH
    
    let evtFile = gameEvtPath+"GameEvent.ts"
    fs.writeFileSync(evtFile,ret)
    console.log("write "+evtFile)
}


// import LoginController from "../modules/login/LoginController"
/**
 * 处理模块
 * @param {} modules 
 */
function handlerModules(modules){
    let tpldt = {}
    tpldt.modulelist = []
    modules.forEach(element => {

        let pt = `../modules/${element.toLocaleLowerCase()}/${element}`


        tpldt.modulelist.push({name:element,c:pt+"Controller",m:pt+"Proxy",e:pt+"Event"})
    });
    var tpl = fs.readFileSync('templates/modules.tpl','utf-8');

    let ret = handlerTemplate(tpl,tpldt)

    let gameEvtPath = GAME_MVC_ROOT_PATH
    
    let moduleFile = gameEvtPath+"modules.ts"
    fs.writeFileSync(moduleFile,ret)
    console.log("write "+moduleFile)
}


/**
 * 生成器执行
 * @param {} _module_configs 
 */
function genRun(_module_configs){
    let evts = []
    let modules = []
    for (const module in _module_configs) {
        let config = _module_configs[module]
        handlerModel(module)
    
        if(config.services){
            handlerService(module)
        }
    
        handlerController(module,config.events,config.views)
        handlerView(config.views,module)
        handlerEvent(module,config.events)

        config.events.forEach(element => {
            evts.push(element)
        });

        modules.push(module)
    }
    handlerTotalEvent(evts) 
    handlerModules(modules)
}




var module_config = require("./module_config.js")
genRun(module_config)