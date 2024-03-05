import H5Bridge from "./H5Bridge";

export class Result {
    public static    SUCC:number = 0;       //成功
    public static    ERROR:number = 3000;   //错误
    public static    CANCEL:number = 2000; //取消


    public static  init(){
    }

    private code:number = Result.SUCC;
    private errorMsg:string;
    private  data:any = {};

    public static  create():Result{
        return new Result();
    }

    /**
     * 当状态异常时
     * @param code
     * @param msg  错误描述
     */
    public setError(code:number, msg:string):Result {
        this.code = code;
        this.errorMsg = msg;

        return this;
    }

    /**
     * 放入数据
     * @param key
     * @param value
     */
    public  put( key:string,value:any):Result {

        this.data[key] = value
        return this;
    }

    /**
     * 执行
     * @param methodType
     */
    public  sdk2logic( methodType:number){

        this.put("methodType",methodType);//放入函数类型
        this.put("errorCode",this.code);  //放入状态码

       

        if(this.code != Result.SUCC){                //当状态为成功时
            this.put("errorMsg", this.errorMsg);
        }

        H5Bridge.bridgeCall(this.data)

    }
}