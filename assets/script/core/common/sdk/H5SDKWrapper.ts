/**
 * 暂时只支持加载一种h5sdk
 */
export default class H5SDKWrapper {
    private sdkClass:any;


    static ins():H5SDKWrapper
    {
        if(!this.inst)
        {
            this.inst = new H5SDKWrapper();
        }
        return this.inst;
    }

    private static inst:H5SDKWrapper;


    public getSdkClass(){
        return this.sdkClass
    }   

    public loadClass(className:string):void{
        var newInstance = Object.create(window[className].prototype) ; 
        newInstance.constructor.apply(newInstance); 
        this.sdkClass = newInstance
    }

    public setSdkInst(inst):void{
        this.sdkClass = inst
    }
}