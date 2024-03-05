import H5SDKWrapper from "./H5SDKWrapper";
import SdkAction from "./SdkAction";

export class H5SDKHelper {
    public static getSdkAction(){
        let sdk = H5SDKWrapper.ins().getSdkClass()
        if(!sdk){
            cc.log("has not h5 sdk ,take default action")
            return new SdkAction()
        }
        return sdk;
    }


    public static logic2Sdk(data){
        let methodType = data.methodType
        // console.log("logic2Sdk",data)
        H5SDKHelper.getSdkAction().doAction(methodType,data)
    }
}