import { Cooldown } from "../base/CoolDown";
import { HeroData } from "../data/HeroData";
import { ECSComponent } from "../ecs/ECSComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { AttackCapability, AttackType } from "../enum/Type";



export class AttackComponent extends ECSComponent {
    public attackCapability: AttackCapability;
    public baseAttackDamageMin: number;
    public baseAttackDamageMax: number;
    public attackRange: number;
    public attackRate: number;
    public attackAnimationPoint: number; // 这个属性在 HeroData 中没有,可能需要另外提供或设置默认值
    public attackAcquisitionRange: number; // 这个属性在 HeroData 中没有,可能需要另外提供或设置默认值
    public attackType: AttackType; // 这个属性在 HeroData 中没有,可能需要另外提供或设置默认值
    public attackDamageType:DamageType;
    private target: ECSEntity | null = null;
    private attacksMade: number = 0;
    private attackCooldown: Cooldown;
    
    // private baseAttackAbility: BaseAttackAbility | null = null;

    constructor(heroData: HeroData) {
        super();
        
        this.attackCapability = this.determineAttackCapability(heroData.GetAttackRange());
        [this.baseAttackDamageMin, this.baseAttackDamageMax] = heroData.GetAttackDamage();
        this.attackRange = heroData.GetAttackRange();
        this.attackRate = heroData.GetAttackRate();
        this.attackAnimationPoint = heroData.GetAttackAnimationPoint();
        this.attackAcquisitionRange = heroData.GetAttackAcquisitionRange();
        this.attackType = heroData.GetAttackType();

        this.attackCooldown = new Cooldown(this.attackRate);
            
        // 创建基础攻击能力
        // this.baseAttackAbility = new BaseAttackAbility(this);
    }

    private determineAttackCapability(attackRange: number): AttackCapability {
        return attackRange > 150 ? AttackCapability.UNIT_CAP_RANGED_ATTACK : AttackCapability.UNIT_CAP_MELEE_ATTACK;
    }

    public getAttackDamage(): number {
        return Math.random() * (this.baseAttackDamageMax - this.baseAttackDamageMin) + this.baseAttackDamageMin;
    }

    public getAttackRange(): number {
        return this.attackRange;
    }

    public getAttackSpeed(): number {
        return 1 / this.attackRate;
    }

    public setTarget(target: ECSEntity | null): void {
        this.target = target;
    }

    public getTarget(): ECSEntity | null {
        return this.target;
    }

    public canAttack(deltaTime: number): boolean {
        return this.attackCooldown.check(deltaTime);
    }

    public updateAttackRate(attackRate: number): void {
        this.attackRate = attackRate;
        this.attackCooldown.resetCooldownRate(attackRate);
    }

    public performAttack(): void {
        if (this.canAttack(0)) {
            this.attacksMade++;
            this.attackCooldown.start();
            // if (this.baseAttackAbility && this.target) {
            //     this.baseAttackAbility.OnAttack(this.target);
            // }
        }
    }

    public getAttacksMade(): number {
        return this.attacksMade;
    }

    public getAttackAnimationPoint(): number {
        return this.attackAnimationPoint;
    }

    public getAttackAcquisitionRange(): number {
        return this.attackAcquisitionRange;
    }

    public getAttackType(): AttackType {
        return this.attackType;
    }

    public getAttackDamageType():DamageType{
        return this.attackDamageType;
    }

    public getActualAttackInterval(attackSpeed: number): number {
        return this.attackRate / (attackSpeed / 100);
    }

    public resetAttacksMade(): void {
        this.attacksMade = 0;
    }

    public isInAcquisitionRange(distance: number): boolean {
        return distance <= this.attackAcquisitionRange;
    }

    public isInAttackRange(distance: number): boolean {
        return distance <= this.attackRange;
    }

    // public getBaseAttackAbility(): BaseAttackAbility | null {
    //     return this.baseAttackAbility;
    // }
}

// export class AttackComponent extends ECSComponent {
//     public attackCapability: AttackCapability;
//     public baseAttackDamageMin: number;
//     public baseAttackDamageMax: number;
//     public attackRange: number;
//     public attackRate: number;
//     public attackAnimationPoint: number;
//     public attackAcquisitionRange: number;
//     public attackType: AttackType;

//     private target: ECSEntity | null = null;
//     private attacksMade: number = 0;
//     private attackCooldown: Cooldown;
//     private baseAttackAbility: BaseAttackAbility | null = null;

//     constructor(
//         abilityData: AbilityData
//     ) {
//         super();
//         this.attackCapability = this.parseAttackCapability(abilityData.GetBehavior());
//         this.baseAttackDamageMin = abilityData.GetLevelSpecialValueFor('base_attack_min', 1);
//         this.baseAttackDamageMax = abilityData.GetLevelSpecialValueFor('base_attack_max', 1);
//         this.attackRange = abilityData.GetCastRange();
//         this.attackRate = abilityData.GetLevelSpecialValueFor('base_attack_time', 1);
//         this.attackAnimationPoint = abilityData.GetLevelSpecialValueFor('attack_point', 1);
//         this.attackAcquisitionRange = abilityData.GetLevelSpecialValueFor('attack_acquisition_range', 1);
//         this.attackType = this.parseAttackType(abilityData.GetAbilityType());
//         this.attackCooldown = new Cooldown(this.attackRate);
        
//         // 创建基础攻击能力
//         this.baseAttackAbility = new BaseAttackAbility(abilityData);
//     }

//     private parseAttackCapability(behavior: number): AttackCapability {
//         // 根据 behavior 解析攻击能力
//         // 这里需要根据实际的 AbilityBehavior 枚举来实现
//         return AttackCapability.UNIT_CAP_MELEE_ATTACK; // 默认为近战攻击
//     }

//     private parseAttackType(abilityType: number): AttackType {
//         // 根据 abilityType 解析攻击类型
//         // 这里需要根据实际的 AbilityType 枚举来实现
//         return AttackType.BasicAttack; // 默认为普通攻击
//     }

//     public getBaseAttackDamage(): number {
//         return Math.random() * (this.baseAttackDamageMax - this.baseAttackDamageMin) + this.baseAttackDamageMin;
//     }

//     public getAttackRange(): number {
//         return this.attackRange;
//     }

//     public getAttackSpeed(): number {
//         return 1 / this.attackRate;
//     }

//     public setTarget(target: ECSEntity | null): void {
//         this.target = target;
//     }

//     public getTarget(): ECSEntity | null {
//         return this.target;
//     }

//     public canAttack(deltaTime: number): boolean {
//         return this.attackCooldown.check(deltaTime);
//     }

//     public updateAttackRate(attackRate: number): void {
//         this.attackRate = attackRate;
//         this.attackCooldown.resetCooldownRate(attackRate);
//     }

//     public performAttack(): void {
//         if (this.canAttack(0)) {
//             this.attacksMade++;
//             this.attackCooldown.start();
//             if (this.baseAttackAbility && this.target) {
//                 this.baseAttackAbility.OnAttack(this.target);
//             }
//         }
//     }

//     public getAttacksMade(): number {
//         return this.attacksMade;
//     }

//     public getAttackAnimationPoint(): number {
//         return this.attackAnimationPoint;
//     }

//     public getAttackAcquisitionRange(): number {
//         return this.attackAcquisitionRange;
//     }

//     public getAttackType(): AttackType {
//         return this.attackType;
//     }

//     public getActualAttackInterval(attackSpeed: number): number {
//         return this.attackRate / (attackSpeed / 100);
//     }

//     public resetAttacksMade(): void {
//         this.attacksMade = 0;
//     }

//     public isInAcquisitionRange(distance: number): boolean {
//         return distance <= this.attackAcquisitionRange;
//     }

//     public isInAttackRange(distance: number): boolean {
//         return distance <= this.attackRange;
//     }

//     public getBaseAttackAbility(): BaseAttackAbility | null {
//         return this.baseAttackAbility;
//     }
// }



// export class AttackComponent extends ECSComponent {
//     public attackCapability: AttackCapability;
//     public baseAttackDamageMin: number;
//     public baseAttackDamageMax: number;
//     public attackRange: number;
//     public attackRate: number;
//     public attackAnimationPoint: number;
//     public attackAcquisitionRange: number;
//     public attackType: AttackType;

//     private target: ECSEntity
//      | null = null;
//     private attacksMade: number = 0;
//     private attackCooldown: Cooldown;

//     constructor(
//         entityId: string,
//         attackCapability: AttackCapability,
//         baseAttackDamageMin: number,
//         baseAttackDamageMax: number,
//         attackRange: number,
//         attackRate: number,
//         attackAnimationPoint: number,
//         attackAcquisitionRange: number,
//         attackType: AttackType
//     ) {
//         super();
//         this.attackCapability = attackCapability;
//         this.baseAttackDamageMin = baseAttackDamageMin;
//         this.baseAttackDamageMax = baseAttackDamageMax;
//         this.attackRange = attackRange;
//         this.attackRate = attackRate;
//         this.attackAnimationPoint = attackAnimationPoint;
//         this.attackAcquisitionRange = attackAcquisitionRange;
//         this.attackType = attackType;
//         this.attackCooldown = new Cooldown(attackRate);
//     }

//     public getBaseAttackDamage(): number {
//         return Math.random() * (this.baseAttackDamageMax - this.baseAttackDamageMin) + this.baseAttackDamageMin;
//     }

//     public getAttackRange(): number {
//         return this.attackRange;
//     }

//     public getAttackSpeed(): number {
//         return 1 / this.attackRate;
//     }

//     public setTarget(target: ECSEntity | null): void {
//         this.target = target;
//     }

//     public getTarget(): ECSEntity | null {
//         return this.target;
//     }

//     public canAttack(deltaTime: number): boolean {
//         return this.attackCooldown.check(deltaTime);
//     }

//     public updateAttackRate(attackRate: number): void {
//         this.attackRate = attackRate;
//         this.attackCooldown.resetCooldownRate(attackRate);
//     }

//     public performAttack(): void {
//         if (this.canAttack(0)) {
//             this.attacksMade++;
//             this.attackCooldown.start();
//             // 这里可以触发攻击事件或直接调用伤害计算
//         }
//     }

//     public getAttacksMade(): number {
//         return this.attacksMade;
//     }

//     public getAttackAnimationPoint(): number {
//         return this.attackAnimationPoint;
//     }

//     public getAttackAcquisitionRange(): number {
//         return this.attackAcquisitionRange;
//     }

//     public getAttackType(): AttackType {
//         return this.attackType;
//     }

//     // 新增方法，用于计算实际攻击间隔
//     public getActualAttackInterval(attackSpeed: number): number {
//         return this.attackRate / (attackSpeed / 100);
//     }

//     // 新增方法，用于重置攻击计数
//     public resetAttacksMade(): void {
//         this.attacksMade = 0;
//     }

//     // 新增方法，用于检查是否在攻击获取范围内
//     public isInAcquisitionRange(distance: number): boolean {
//         return distance <= this.attackAcquisitionRange;
//     }

//     // 新增方法，用于检查是否在攻击范围内
//     public isInAttackRange(distance: number): boolean {
//         return distance <= this.attackRange;
//     }
// }