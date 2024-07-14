import { Modifier, ModifierCategoryDispatcher, ModifierEventDispatcher } from "../ability/Modifier";
import { ModifierComponent } from "../component/ModifierComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierAttribute } from "../enum/Modifier";
import { ModifierCategory } from "../enum/ModifierCategory";
import { ModifierEvent } from "../enum/ModifierEvent";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierState } from "../enum/ModifierState";
// Modifier状态跟踪
// 每个Modifier都有一个内部状态标记,用于指示该Modifier是否已被修改。当一个Modifier的值或状态发生变化时(比如被添加、移除、数值改变等),它的状态标记会被设置为"脏"(dirty)。
// 缓存上一帧结果
// ModifierManager会为每种属性值维护一个缓存,存储上一帧计算出的结果。只有当相关的Modifier发生变化时,才需要重新计算该属性值。
// 增量式计算
// 当确实需要重新计算某个属性值时,ModifierManager不会从头开始遍历所有Modifier。相反,它会先从缓存中取出上一帧的结果作为基准,然后只计算状态发生变化的那部分Modifier的增量效果,再将这个增量应用到基准值上,从而得到新的最终结果。
// 批量更新
// ModifierManager并不会在每次Modifier发生变化时就立即重新计算所有受影响的属性值。相反,它会先记录下所有发生变化的Modifier,等到需要使用某个属性值时,再统一进行一次批量计算和更新。

export class ModifierManager {
    private static instance: ModifierManager;

    private modifierEventDispatcher:ModifierEventDispatcher;

    private constructor() {
        this.modifierEventDispatcher = ModifierEventDispatcher.getInstance();
    }

    public static getInstance(): ModifierManager {
        if (!ModifierManager.instance) {
            ModifierManager.instance = new ModifierManager();
        }
        return ModifierManager.instance;
    }

    public addModifier(entity: ECSEntity, modifier: Modifier): void {
        const modifierComponent = entity.getComponent(ModifierComponent);
        if (!modifierComponent) {
            console.error("Entity does not have a ModifierComponent");
            return;
        }

        if (this.isInState(entity, ModifierState.MODIFIER_STATE_INVULNERABLE) && !modifier.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE)) {
            console.log("Entity is invulnerable, modifier not applied");
            return;
        }

        if (modifier.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_MULTIPLE)) {
            modifierComponent.addModifier(modifier);
            modifier.OnCreated();

            modifier.ListListenEvents().forEach(event => {
                this.modifierEventDispatcher.addEventListener(event, modifier.onModifierEvent);
            });

        } else {
            const existingModifier = modifierComponent.getModifiers().find(mod => mod.id === modifier.id);
            if (existingModifier) {
                existingModifier.handleStacking(modifier);
            } else {
                modifierComponent.addModifier(modifier);
                modifier.OnCreated();
                modifier.ListListenEvents().forEach(event => {
                    this.modifierEventDispatcher.addEventListener(event, modifier.onModifierEvent);
                });
               
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
                modifier.ListListenEvents()?.forEach(event => {
                    this.modifierEventDispatcher.removeEventListener(event,modifier.onModifierEvent);
                });
            }
        }
    }

    public triggerModifierEvent(event: ModifierEvent, params: any): void {
        this.modifierEventDispatcher.notifyEventListeners(event,  params);
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
