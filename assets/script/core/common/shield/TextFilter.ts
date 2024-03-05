export default class TextFilter{
    private static inst:TextFilter;

   

    static ins():TextFilter
    {
        if(!this.inst)
        {
            this.inst = new TextFilter();
        }
        return this.inst;
    }

    public isValid(str:string):boolean{
        return true
    }

    public init():void{
        
    }
}