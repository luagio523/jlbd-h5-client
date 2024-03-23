import { IModifierValueGetter, ModifierMapping } from "../ability/Modifier";
import { ECSComponent } from "../ecs/ECSComponent";
import { ModifierFunction } from "../enum/Modifier";
import { Equipment } from "../item/Equipment";




export class EquipmentComponent extends ECSComponent {

    private modifierMapping = new ModifierMapping(); // 创建 ModifierMapping 实例


    public equips: Array<Equipment> = [];

    public addEquip(equip:Equipment):void{
        if (!equip) return;
        this.equips.push(equip);

        // 使用 ModifierMapping 实例来管理 getter 的添加
        let funcGetterPairs = equip.ListDeclareFunctions();
        for (let [modFunc, modGetter] of funcGetterPairs) {
            this.modifierMapping.add(modFunc, modGetter);
        }
    }


    public removeBuff(equip:Equipment): void {
        const index = this.equips.indexOf(equip);
        if (index !== -1) {
            // 从 buffs 数组中移除指定的 Buff
            this.equips.splice(index, 1);

            // 使用 ModifierMapping 实例来管理 getter 的移除
            let funcGetterPairs = equip.ListDeclareFunctions();
            for (let [modFunc, modGetter] of funcGetterPairs) {
                this.modifierMapping.remove(modFunc, modGetter as IModifierValueGetter);
            }
        }
    }

    public getModifierMapping(): ModifierMapping{
        return this.modifierMapping
    }

}