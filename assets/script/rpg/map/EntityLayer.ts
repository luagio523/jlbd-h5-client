import { Node } from "cc";
import scheduler from "../../utils/scheduler";

export default class EntityLayer extends Node{
    public constructor(){
        super()
        // //定时排序实体层
		scheduler.scheduleGlobal(this.sortEntity.bind(this),1)
    }

    public sortEntity() {
		this.children.sort((d1:Node, d2:Node)=> d2.position.y - d1.position.y);
	};

    //maybe 
    private sortZindex()
    {
        var allEntityNodes:Node[] = this.children.slice();

        allEntityNodes.sort((node1:Node,node2:Node):number=>
        {
            if(node1.position.y > node2.position.y)
            {
                return -1
            }else if(node1.position.y < node2.position.y)
            {
                return 1;
            }

            return 0;
        });

        var entiryCount:number = allEntityNodes.length;
        for(var i = 0 ; i < entiryCount; i++)
        {
            allEntityNodes[i].setSiblingIndex(i);
        }
    }
	
}