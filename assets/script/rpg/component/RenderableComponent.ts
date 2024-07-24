import { Node } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";
import { ActType } from "../enum/Act";

export class RenderableComponent extends ECSComponent {
    public  node:Node = null;
    public changeAct(act:ActType):void{

    }
}