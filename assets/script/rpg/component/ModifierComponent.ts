import { ECSComponent } from "../ecs/ECSComponent";
import { ModifierFunction } from "../enum/ModifierFunction";
import { Modifier, ModifierEventDispatcher } from "../ability/Modifier";
import { ModifierEvent } from "../enum/ModifierEvent";
import { ModifierAttribute } from "../enum/Modifier";
import { ModifierState } from "../enum/ModifierState";



// Modifier状态跟踪
// 每个Modifier都有一个内部状态标记,用于指示该Modifier是否已被修改。当一个Modifier的值或状态发生变化时(比如被添加、移除、数值改变等),它的状态标记会被设置为"脏"(dirty)。
// 缓存上一帧结果
// ModifierManager会为每种属性值维护一个缓存,存储上一帧计算出的结果。只有当相关的Modifier发生变化时,才需要重新计算该属性值。
// 增量式计算
// 当确实需要重新计算某个属性值时,ModifierManager不会从头开始遍历所有Modifier。相反,它会先从缓存中取出上一帧的结果作为基准,然后只计算状态发生变化的那部分Modifier的增量效果,再将这个增量应用到基准值上,从而得到新的最终结果。
// 批量更新
// ModifierManager并不会在每次Modifier发生变化时就立即重新计算所有受影响的属性值。相反,它会先记录下所有发生变化的Modifier,等到需要使用某个属性值时,再统一进行一次批量计算和更新。

export class ModifierComponent extends ECSComponent {

    private modifierEventDispatcher: ModifierEventDispatcher = ModifierEventDispatcher.getInstance();

    private modifiers: Modifier[] = [];
    private dirty: boolean = true;
    private cache: Map<ModifierFunction, number> = new Map();

    onModifierEvent(event: ModifierEvent, data: any) {
        this.modifierEventDispatcher.dispatchEvent(event, data);
    }

    addModifier(modifier: Modifier) {
        modifier.ListListenEvents().forEach(event => {
            this.modifierEventDispatcher.addEventListener(event, modifier.onModifierEvent);
        });
        this.modifiers.push(modifier);
        // 处理光环优先级
        if (modifier.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_AURA_PRIORITY)) {
            this.modifiers.sort((a, b) => {
                const aHasAuraPriority = a.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_AURA_PRIORITY);
                const bHasAuraPriority = b.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_AURA_PRIORITY);

                if (aHasAuraPriority && !bHasAuraPriority) {
                    return -1;
                }
                if (!aHasAuraPriority && bHasAuraPriority) {
                    return 1;
                }
                return b.priority - a.priority;
            });
        } else {
            this.modifiers.sort((a, b) => b.priority - a.priority);
        }
        this.markDirty();
    }


    removeModifier(modifierId: string) {
        const index = this.modifiers.findIndex(m => m.id === modifierId);
        const modifier = this.modifiers[index];
        if (modifier) {
            modifier.ListListenEvents()?.forEach(event => {
                this.modifierEventDispatcher.removeEventListener(event,modifier.onModifierEvent);
            });
        }
        if (index !== -1) {
            this.modifiers.splice(index, 1);
            this.markDirty();
        }
    }

    getModifiers(): Modifier[] {
        return this.modifiers;
    }

    markDirty() {
        this.dirty = true;
        this.cache.clear();
    }

    isDirty(): boolean {
        return this.dirty;
    }


    clearDirty() {
        this.dirty = false;
    }

    private calculateModifierValue( func: ModifierFunction): number {
        return this.getModifiers().reduce((total, modifier) => {
            return total + modifier.getModifierValue(func);
        }, 0);
    }


    private recalculateCache(): void {
        for (const modifier of this.getModifiers()) {
            for (const func of modifier.ListModifierFunctions()) {
                const value = this.calculateModifierValue(func);
                this.cache.set(func, value);
            }
        }
        this.clearDirty();
    }


    public getModifierValue(func: ModifierFunction): number {
        if (this.isDirty()) {
            this.recalculateCache();
        }
        return this.cache.get(func) || 0;
    }


    public isInState(state: ModifierState): boolean {
        return this.getModifiers().some(modifier => modifier.getModifierState(state));
    }
}

