import { Node } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";
import { ActType } from "../enum/Act";
import { Character } from "../render/character/Character";

export class RenderableComponent extends ECSComponent {
    public  character:Character = null;
    public  constructor(character?:Character){
        super();
        this.initialize(character);
    }

    public initialize(character?:Character):void{
        if(character == null){
            return 
        }
        this.character = character;
    }

    public changeAct(act:ActType):void{

    }

    public getNode():Node{
        return this.character.getNode();
    }


    public update(dt:number):void{
        this.character.update(dt);
    }
}