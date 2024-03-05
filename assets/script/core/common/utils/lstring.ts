import { StringUtil } from "./StringUtil";

/*
兼容luastring
*/
export default class lstring{
    public static sub(str:string,index:number):string{
        return str.substring(index-1)
    }

    public static upper(str:string):string{
        return str.toUpperCase()
    }

    public static lower(str:string):string{
        return str.toLowerCase()
    }

    public static find(str:string,tag:string):boolean{
        return str.indexOf(tag)>-1
    }

    public static gsub(str:string,tag:string,rep:string):string{
        return str.replace(new RegExp(tag,"g"),rep)
    }

    public static trim(str:string):string{
        return StringUtil.trim(str)
    }

    public static len(str:string):number{
        return str ? str.length : 0
    }
    public static char(charNumber:number):string{
        return String.fromCharCode(charNumber)
    }
}



export function tonumber(num:any):number{
    if(!num){
        return 0
    }
    if(typeof(num) == "number"){
        return num
    }
    if(typeof(num) == "string"){
        return Number(num)
    }
    if(typeof(num) == "object"){
        return num.toNumber()
    }
    return 0
}

export function tostring(num:any):string{
    return num+""
}


export function checknumber(value){
    return tonumber(value) || 0 
}

export function checkint(value){
    return Math.round(checknumber(value))
}

export function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}