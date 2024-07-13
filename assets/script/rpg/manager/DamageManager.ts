import { BaseAbility } from "../ability/BaseAbility";
import { AbilityDamageCalculator } from "../calculator/AbilityDamageCalculator";
import { AttackDamageCalculator } from "../calculator/AttackDamageCalculator";
import { AbilityComponent } from "../component/AbilityComponent";
import { HealthComponent } from "../component/HealthComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { ModifierManager } from "./ModifierManager";

interface DamageInfo {
    attacker: ECSEntity;
    victim: ECSEntity;
    damage: number;
    damageType: DamageType;
    ability?: BaseAbility;
}

export class DamageManager {
    private static instance: DamageManager;
    private abilityDamageCalculator: AbilityDamageCalculator;
    private attackDamageCalculator: AttackDamageCalculator;

    private constructor(modifierManager: ModifierManager) {
        this.abilityDamageCalculator = new AbilityDamageCalculator(modifierManager);
        this.attackDamageCalculator = new AttackDamageCalculator(modifierManager);
    }

    public static getInstance(modifierManager?: ModifierManager): DamageManager {
        if (!DamageManager.instance) {
            if (!modifierManager) {
                throw new Error("ModifierManager must be provided when creating DamageManager instance");
            }
            DamageManager.instance = new DamageManager(modifierManager);
        }
        return DamageManager.instance;
    }

   

    public ApplyDamage(damageInfo: DamageInfo): number {

        if (damageInfo.damage <= 0) {
            return 0;
        }
        let finalDamage = damageInfo.damage;

        this.applyDamageToVictim(damageInfo.victim, finalDamage);
        this.notifyDamageDealt(damageInfo, finalDamage);

        return finalDamage;
    }

   

    private applyDamageToVictim(victim: ECSEntity, damage: number): void {
        const healthComponent = victim.getComponent(HealthComponent);
        if (healthComponent) {
            healthComponent.takeDamage(damage);
        }
    }

   

    private notifyDamageDealt(damageInfo: DamageInfo, finalDamage: number): void {
        const attackerAbilityComponent = damageInfo.attacker.getComponent(AbilityComponent)  ;
        const victimAbilityComponent = damageInfo.victim.getComponent(AbilityComponent)  ;

        if (attackerAbilityComponent) {
            attackerAbilityComponent.onOwnerDealDamage(damageInfo.victim, finalDamage, damageInfo.damageType);
        }

        if (victimAbilityComponent) {
            victimAbilityComponent.onOwnerTakeDamage(damageInfo.attacker, finalDamage, damageInfo.damageType);
        }

        if (damageInfo.ability) {
            damageInfo.ability.OnAbilityDealDamage(damageInfo.victim, finalDamage, damageInfo.damageType);
        }
    }

    
}