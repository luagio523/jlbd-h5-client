import { Modifier } from "../ability/Modifier";
import { ModifierComponent } from "../component/ModifierComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierState } from "../enum/ModifierState";

import { ModifierManager } from "../manager/ModifierManager";
import { BaseSystem } from "./BaseSystem";

export class ModifierSystem extends BaseSystem {
    private modifierManager: ModifierManager;

    constructor() {
        super();
        this.modifierManager = ModifierManager.getInstance();
    }

    update(deltaTime: number) {
        const entities = this.getEntitiesWithComponent(ModifierComponent);
        
        for (const entity of entities) {
            this.modifierManager.updateModifiers(entity, deltaTime);
            
            // 检查并应用modifier效果
            this.applyModifierEffects(entity);
        }
    }

    private applyModifierEffects(entity: ECSEntity) {
        const modifiers = this.modifierManager.getModifiers(entity);
        
        // for (const modifier of modifiers) {
        //     // 应用modifier的效果，例如：
        //     if (modifier.ListDeclareFunctions().includes(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE)) {
        //         const speedBonus = modifier.getModifierValue(ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE, entity);
        //         // 应用速度加成...
        //     }
        //     // 添加其他modifier效果的应用...
        // }
    }

    addModifier(entity: ECSEntity, modifier: Modifier) {
        this.modifierManager.addModifier(entity, modifier);
    }

    removeModifier(entity: ECSEntity, modifierId: string) {
        this.modifierManager.removeModifier(entity, modifierId);
    }

    getModifierValue(entity: ECSEntity, func: ModifierFunction): number {
        return this.modifierManager.getModifierValue(entity, func);
    }

    isInState(entity: ECSEntity, state: ModifierState): boolean {
        return this.modifierManager.isInState(entity, state);
    }
}