import { Aura } from "../ability/Aura";
import { ECSComponent } from "../ecs/ECSComponent";

// 改造后的AuraComponent仅存储Aura实例
export class AuraComponent extends ECSComponent {
    public auras: Aura[] = [];
}