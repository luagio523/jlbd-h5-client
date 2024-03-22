import { BaseAbility } from "../ability/BaseAbility";
import { ECSComponent } from "../ecs/ECSComponent";

export class AbilityComponent extends ECSComponent {
    public abilityList:Array<BaseAbility>
}