import { ECSEntity } from "../ecs/ECSEntity";

export enum EquipmentType {
    EQUIP_TYPE_WEAPON = 1,
    EQUIP_TYPE_ARMOR = 2,
}


export abstract class Equipment {
    public equipType: EquipmentType;

    constructor(type: EquipmentType) {
        this.equipType = type;
    }


    // 当装备被装备时调用
    public onEquip(entity: ECSEntity): void {
        // 对实体应用装备提供的效果
        // 比如更新状态，增加属性，应用光环等
    }

    // 当装备被卸下时调用
    public onUnequip(entity: ECSEntity): void {
        // 移除之前应用的效果
        // 比如恢复状态，减少属性，停止光环效果等
    }

    // 其他共通的属性和行为
}


export class Weapon extends Equipment {
    public damage: number;
    public attackSpeed: number;

    

    // 其他武器特有的属性和行为
}

export class Armor extends Equipment {
    public defense: number;

    

    // 其他盔甲特有的属性和行为
}

export class Accessory extends Equipment {
    public critChance: number;
    // 其他配饰特有的属性和行为
}