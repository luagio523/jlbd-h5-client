
export default class json {
    public static decode(text:string):Object{
        return JSON.parse(text)
    }

    public static encode(text:any):string{
        return JSON.stringify(text)
    }
}