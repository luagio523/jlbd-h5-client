import { ECSComponent } from "../ecs/ECSComponent";
import { Buff } from "../ability/Buff";
import { ModifierFunction } from "../enum/Modifier";
import {  IModifierValueGetter, ModifierMapping } from "../ability/Modifier";





export class BuffComponent extends ECSComponent {

    protected buffs: Buff[] = [];
    private modifierMapping = new ModifierMapping(); // 创建 ModifierMapping 实例

    public addBuff(buff: Buff): void {
        if (!buff) return;
        this.buffs.push(buff);

        // 使用 ModifierMapping 实例来管理 getter 的添加
        let funcGetterPairs = buff.ListDeclareFunctions();
        for (let [modFunc, modGetter] of funcGetterPairs) {
            this.modifierMapping.add(modFunc, modGetter);
        }
    }

    public removeBuff(buff: Buff): void {
        const index = this.buffs.indexOf(buff);
        if (index !== -1) {
            // 从 buffs 数组中移除指定的 Buff
            this.buffs.splice(index, 1);

            // 使用 ModifierMapping 实例来管理 getter 的移除
            let funcGetterPairs = buff.ListDeclareFunctions();
            for (let [modFunc, modGetter] of funcGetterPairs) {
                this.modifierMapping.remove(modFunc, modGetter as IModifierValueGetter);
            }
        }
    }

    public getModifierMapping(): ModifierMapping{
        return this.modifierMapping
    }
}


