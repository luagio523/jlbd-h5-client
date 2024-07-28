import { Node } from "cc";
import { ECSComponent } from "../ecs/ECSComponent";
import { ActType } from "../enum/Act";
import { CharacterRenderer } from "../render/character/CharacterRenderer";

export class RenderableComponent extends ECSComponent {
    public  characterRenderer:CharacterRenderer = null;
    public  constructor(characterRenderer?:CharacterRenderer){
        super();
        this.initialize(characterRenderer);
    }

    public initialize(characterRenderer?:CharacterRenderer):void{
        if(characterRenderer == null){
            return 
        }
        this.characterRenderer = characterRenderer;
    }

    public changeAct(act:ActType):void{

    }

    public getNode():Node{
        return this.characterRenderer.getNode();
    }
}