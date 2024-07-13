import { ECSComponent } from "../ecs/ECSComponent";
import { ModifierFunction } from "../enum/ModifierFunction";
import { Modifier, ModifierEventDispatcher } from "../ability/Modifier";
import { ModifierEvent } from "../enum/ModifierEvent";
import { ModifierAttribute } from "../enum/Modifier";
import { ModifierState } from "../enum/ModifierState";

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
            for (const func of modifier.ListDeclareFunctions()) {
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

