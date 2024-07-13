import { ECSComponent } from "../ecs/ECSComponent";
import { ModifierFunction } from "../enum/ModifierFunction";
import { Modifier, ModifierEventDispatcher } from "../ability/Modifier";
import { ModifierEvent } from "../enum/ModifierEvent";




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
            this.modifierEventDispatcher.addEventListener(event,modifier.onModifierEvent);
        });
        this.modifiers.push(modifier);
        this.modifiers.sort((a, b) => b.priority - a.priority);
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

    getCache(): Map<ModifierFunction, number> {
        return this.cache;
    }

    setCache(func: ModifierFunction, value: number) {
        this.cache.set(func, value);
    }

    clearDirty() {
        this.dirty = false;
    }
}

