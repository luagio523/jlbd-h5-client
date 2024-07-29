import { ECSComponent } from "../ecs/ECSComponent";
import { ecsclass } from "../ecs/__private";


ecsclass("DefenseComponent")
export class DefenseComponent extends ECSComponent{
    public armorPhysical: number;
    public magicResistance:number

    
}

