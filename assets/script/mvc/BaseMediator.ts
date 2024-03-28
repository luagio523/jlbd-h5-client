import { GComponent, GObject } from "fairygui-cc"
import { Mediator } from "../core/mvc/init"



export default class BaseMediator extends Mediator  {
    public param:any //创建时的参数

   


    
    public onAdded(param:any):void{
        this.param = param
        this.initUI()
    }

    public onRemoved(param:any):void{

    }
      
    /**
     * 初始化ui
     */
    protected initUI(){

    }


    public close(){
        
    }
    
    ////////////////////////////////////////////////////////////////////////

    /**
     * 处理适配
     */
    public resetAdapt(){

    }

    protected get view() :GComponent {
        return this.viewComponent 
    }
    
     /**
     * 根据路径获取借点
     * 类似cc.find()
     */
    public  findChild(path:string, referenceNode?:GObject):GObject{
        referenceNode = referenceNode || this.view

        var match:any = referenceNode;
        var startIndex = (path[0] !== '/') ? 0 : 1; // skip first '/'
        var nameList = path.split('/');


        // parse path
        for (var n = startIndex; n < nameList.length; n++) {
            var name = nameList[n];
            var children = match._children;
            
            match = null;
            for (var t = 0, len = children.length; t < len; ++t) {
                var subChild = children[t];
                if (subChild.name == name) {
                    match = subChild;
                    break;
                }
            }
            if (!match) {
                return null;
            }
        }
        return match;
    }
     /**
     * 获取名字为name的节点
     * 递归
     */
    public  getUIChild(name:string){
        if (this.view) {
	        return this.seekChild(this.view, name)
	    }
    }

   
    /**
     * 查找parent 下 名字为name的节点
     * 效率低下
     */
    public seekChild(parent:GComponent,name:string){
        if(!parent){
            return
        }
        if(parent.name == name ){
            return parent
        }
        for (let index = 0; index < parent.numChildren; index++) {
            const child:any = parent.getChildAt(index);
            let node = this.seekChild(child,name)
            if (node){
                return node
            }
        }
        return null
    }
    
}


