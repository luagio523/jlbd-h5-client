import { Modifier } from "../ability/Modifier";
import { ModifierComponent } from "../component/ModifierComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierAttribute } from "../enum/Modifier";
import { ModifierEvent } from "../enum/ModifierEvent";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierState } from "../enum/ModifierState";

export class ModifierManager {
    private static instance: ModifierManager;

    private constructor() {}

    public static getInstance(): ModifierManager {
        if (!ModifierManager.instance) {
            ModifierManager.instance = new ModifierManager();
        }
        return ModifierManager.instance;
    }

    public addModifier(entity: ECSEntity, newModifier: Modifier): void {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (!modifierComponent) {
            console.error("Entity does not have a ModifierComponent");
            return;
        }

        if (this.isInState(entity, ModifierState.MODIFIER_STATE_INVULNERABLE) && !newModifier.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE)) {
            console.log("Entity is invulnerable, modifier not applied");
            return;
        }

        if (newModifier.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_MULTIPLE)) {
            modifierComponent.addModifier(newModifier);
            newModifier.OnCreated();
        } else {
            const existingModifier = modifierComponent.getModifiers().find(mod => mod.id === newModifier.id);
            if (existingModifier) {
                existingModifier.handleStacking(newModifier);
            } else {
                modifierComponent.addModifier(newModifier);
                newModifier.OnCreated();
            }
        }
       
    }

    public removeModifier(entity: ECSEntity, modifierId: string): void {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (modifierComponent) {
            const modifier = modifierComponent.getModifiers().find(m => m.id === modifierId);
            if (modifier) {
                modifier.OnDestroy();
                modifierComponent.removeModifier(modifierId);
            }
        }
    }

    public triggerEvent(entity: ECSEntity, event: ModifierEvent, params: any): void {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (modifierComponent) {
            modifierComponent.onModifierEvent(event, params);
        }
    }

    public getModifierValue(entity: ECSEntity, func: ModifierFunction): number {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (!modifierComponent) return 0;
        return modifierComponent.getModifierValue(func);
    }
  

    public getModifiers(entity: ECSEntity): Modifier[] {
        const modifierComponent = entity.getComponent(ModifierComponent);
        return modifierComponent ? modifierComponent.getModifiers() : [];
    }

    public isInState(entity: ECSEntity, state: ModifierState): boolean {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (!modifierComponent) return false;
        return modifierComponent.isInState(state);
    }

    
    public updateModifiers(entity: ECSEntity, deltaTime: number): void {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (modifierComponent) {
            const modifiers = modifierComponent.getModifiers();
            for (let i = modifiers.length - 1; i >= 0; i--) {
                const modifier = modifiers[i];
                modifier.update(deltaTime);
                if (modifier.isExpired()) {
                    this.removeModifier(entity, modifier.id);
                }
            }
        }
    }
}
