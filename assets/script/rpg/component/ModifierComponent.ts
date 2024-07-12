import { ECSComponent } from "../ecs/ECSComponent";
import { Buff } from "../ability/Buff";
import { ModifierFunction } from "../enum/Modifier";
import { Modifier } from "../ability/Modifier";




export class ModifierComponent extends ECSComponent {
    private modifiers: Modifier[] = [];
    private dirty: boolean = true;
    private cache: Map<ModifierFunction, number> = new Map();

    addModifier(modifier: Modifier) {
        this.modifiers.push(modifier);
        this.modifiers.sort((a, b) => b.priority - a.priority);
        this.markDirty();
    }

    removeModifier(modifierId: string) {
        const index = this.modifiers.findIndex(m => m.id === modifierId);
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

