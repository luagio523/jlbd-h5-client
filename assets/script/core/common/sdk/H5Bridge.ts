export default class H5Bridge{
    private static  bridgeLink:Function
    public static register(func:Function){
        H5Bridge.bridgeLink = func
    }

    public static bridgeCall(data){
        if(H5Bridge.bridgeLink){
            console.log("bridgeCall",data)
            H5Bridge.bridgeLink(data)
        }
    }
}