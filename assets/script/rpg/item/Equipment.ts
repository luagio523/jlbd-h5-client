export abstract class Equipment {
    public name: string;
    public type: string;

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
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

    constructor(name: string, damage: number, attackSpeed: number) {
        super(name, 'Weapon');
        this.damage = damage;
        this.attackSpeed = attackSpeed;
    }

    // 其他武器特有的属性和行为
}

export class Armor extends Equipment {
    public defense: number;

    constructor(name: string, defense: number) {
        super(name, 'Armor');
        this.defense = defense;
    }

    // 其他盔甲特有的属性和行为
}

export class Accessory extends Equipment {
    public critChance: number;

    constructor(name: string, critChance: number) {
        super(name, 'Accessory');
        this.critChance = critChance;
    }

    // 其他配饰特有的属性和行为
}