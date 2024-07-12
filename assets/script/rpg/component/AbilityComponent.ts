import { BaseAbility } from "../ability/BaseAbility";
import { ECSComponent } from "../ecs/ECSComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";

export class AbilityComponent extends ECSComponent {
    private abilities: BaseAbility[] = [];

    
  

    addAbility(ability: BaseAbility): void {
        this.abilities.push(ability);
    }

    getAbility(index: number): BaseAbility | null {
        return this.abilities[index] || null;
    }

    getAbilities(): BaseAbility[] {
        return this.abilities;
    }

    removeAbility(index: number): void {
        this.abilities.splice(index, 1);
    }

    onOwnerDealDamage(target: ECSEntity, damage: number, damageType: DamageType): void {
        this.abilities.forEach(ability => ability.OnOwnerDealDamage(target, damage, damageType));
    }

    onOwnerTakeDamage(attacker: ECSEntity, damage: number, damageType: DamageType): void {
        this.abilities.forEach(ability => ability.OnOwnerTakeDamage(attacker, damage, damageType));
    }

    onOwnerDied(): void {
        this.abilities.forEach(ability => ability.OnOwnerDied());
    }

    onOwnerSpawned(): void {
        this.abilities.forEach(ability => ability.OnOwnerSpawned());
    }
}



// const juggernaut = new Juggernaut();

// // 获取剑圣的技能组件
// const abilityComponent = juggernaut.getAbilityComponent();

// // 使用技能
// const bladeFury = abilityComponent.getAbility(0);
// if (bladeFury && bladeFury.CanBeExecuted()) {
//     bladeFury.OnSpellStart();
// }