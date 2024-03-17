import { BaseAbility } from "../BaseAbility";
import { ECSComponent } from "../ecs/ECSComponent";

export class AbilityComponent extends ECSComponent {
    public abilityList:Array<BaseAbility>
}