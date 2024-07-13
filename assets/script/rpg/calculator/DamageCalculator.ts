
import { AttributeComponent } from "../component/AttributeComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { ModifierFunction } from "../enum/ModifierFunction";
import { Attributes } from "../enum/Type";
import { ModifierManager } from "../manager/ModifierManager";
import { ArmorCalculator } from "./ArmorCalculator";
import { AttributeCalculator } from "./AttributeCalculator";
import { CriticalStrikeCalculator } from "./CriticalStrikeCalculator";
import { EvasionAndBlockCalculator } from "./EvasionAndBlockCalculator";
import { MagicResistanceCalculator } from "./MagicResistanceCalculator";


// 普通攻击流程
// -- 检查是否miss（闪避）
// -- 处理miss效果
// -- 计算基础攻击伤害
// -- 检查暴击
// -- 检查格挡
// -- 应用伤害
//    -- 防御等等



export class DamageCalculator {
    protected modifierManager: ModifierManager;
    private armorCalculator: ArmorCalculator;
    private magicResistanceCalculator: MagicResistanceCalculator;
    protected attributeCalculator: AttributeCalculator;
    private criticalStrikeCalculator: CriticalStrikeCalculator;
    private evasionAndBlockCalculator: EvasionAndBlockCalculator;

    constructor(modifierManager: ModifierManager) {
        this.modifierManager = modifierManager;
        this.armorCalculator = new ArmorCalculator(modifierManager);
        this.magicResistanceCalculator = new MagicResistanceCalculator(modifierManager);
        this.attributeCalculator = new AttributeCalculator(modifierManager);
        this.criticalStrikeCalculator = new CriticalStrikeCalculator(modifierManager);
        this.evasionAndBlockCalculator = new EvasionAndBlockCalculator(modifierManager);
    }


    public calculatePreDefenseAttackDamage(attacker: ECSEntity, target: ECSEntity, damageType: DamageType): number {


        // 伤害类型转换
        damageType = this.checkDamageTypeConversion(attacker, damageType);


        if (damageType === DamageType.DAMAGE_TYPE_PHYSICAL) {
            // 闪避检查
            if (this.evasionAndBlockCalculator.calculateFinalEvasion(target) <=0){
                return 0 ;
            }
        }

        let baseAttackDamage =  this.calculateBaseAttackPower(attacker); //基础攻击
        let baseDamagePercent = 1 + this.modifierManager.getModifierValue(attacker, ModifierFunction.MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE) / 100;
        baseAttackDamage *= baseDamagePercent; // 基础伤害加成

        let bonusAttackDamage = this.calculateBonusAttackPower(attacker); // 额外攻击力
         
        let totalAttackDamage = baseAttackDamage + bonusAttackDamage; // 总攻击力

          // 暴击检查
        if (damageType === DamageType.DAMAGE_TYPE_PHYSICAL) {
            const critMultiplier = this.criticalStrikeCalculator.calculateFinalCriticalStrike(attacker); //暴击伤害 = (基础攻击力 + 额外攻击力) * 暴击倍数
            totalAttackDamage *= critMultiplier;
        }
        //   // 暴击后额外伤害
        // totalAttackDamage += this.calculatePostCritBonusDamage(attacker);

         // 应用闪避和格挡（只对物理伤害有效）
        if (damageType === DamageType.DAMAGE_TYPE_PHYSICAL) {
            totalAttackDamage = this.evasionAndBlockCalculator.calculateFinalBlock(target, totalAttackDamage);
        }

        let totalDamagePercent = this.modifierManager.getModifierValue(attacker, ModifierFunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE) / 100;
        totalAttackDamage *= totalDamagePercent; // 总伤害加成

    }

    public calculateApplyDamage(attacker: ECSEntity, target: ECSEntity, damage: number, damageType: DamageType): number {
        

        // let totalDamagePercent = this.modifierManager.getModifierValue(attacker, ModifierFunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE) / 100;
        // damage *= totalDamagePercent; // 总伤害加成

        damage = this.applyDefenses(attacker, target, damage, damageType);

        damage = this.applyDamageReduction(attacker, damage, damageType);

        return damage;
    }


    /**
     * 计算伤害增幅
     * @param entity 
     * @param damageType 
     * @returns 
     */
    protected calculateDamageAmplification(entity: ECSEntity, damageType: DamageType): number {
        let amplification = 1;
        return amplification
    }

    /**
     * 计算伤害减免
     * @param entity 
     * @param damageType 
     * @returns 
     */
    protected applyDamageReduction(entity: ECSEntity,  damage: number,damageType: DamageType): number {
        return damage
    }


    protected applyDefenses(attacker: ECSEntity, target: ECSEntity, damage: number, damageType: DamageType): number {
        switch (damageType) {
            case DamageType.DAMAGE_TYPE_PHYSICAL:
                if (this.modifierManager.getModifierValue(attacker,  ModifierFunction.MODIFIER_PROPERTY_IGNORE_PHYSICAL_ARMOR) == 1) {   // 忽略物理防御;
                    return damage;
                }
                const armor = this.armorCalculator.calculateFinalArmor(target);
                const armorReduction = 1 - (0.06 * armor) / (1 + 0.06 * Math.abs(armor));
                return damage * armorReduction;
            case DamageType.DAMAGE_TYPE_MAGICAL:
                const magicResistance = this.magicResistanceCalculator.calculateFinalMagicResistance(target);
                return damage * (1 - magicResistance/100);
            case DamageType.DAMAGE_TYPE_PURE:
            case DamageType.DAMAGE_TYPE_ABILITY_DEFINED:
                return damage;
            default:
                return damage;
        }
    }


    public calculatePreAttackBonusDamage(entity: ECSEntity, damageType: DamageType): number {
        let bonusDamage = 0;
        bonusDamage += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE);
        bonusDamage += this.calculateProcAttackBonusDamage(entity, damageType);
        return bonusDamage; 
    }


    public calculateBaseAttackDamage(entity: ECSEntity): number {
        let baseDamage =   this.calculateBaseAttackPower(entity);
        let baseDamagePercent = 1 + this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE) / 100;
        baseDamage *= baseDamagePercent;
        return baseDamage;
    }

    public calculateBonusAttackDamage(entity: ECSEntity): number {
        return  this.calculateBonusAttackPower(entity);
    }


    public calculateBaseAttackPercentage(entity: ECSEntity): number {
        return  this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE) / 100;
    }


 


      // 计算白字攻击力
     //白字攻击力 = 初始攻击力 + (力量值 × 1) + 等级成长攻击力 + MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE
     public calculateBaseAttackPower(entity: ECSEntity): number {
        // 获取基础攻击力
        let baseAttackPower = this.calculateBaseAttackPower(entity);
    
        // 加上属性带来的攻击力
        baseAttackPower += this.calculateAttributeAttackPower(entity);
    
        // 加上基础攻击力加成
        baseAttackPower += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE);
    
        // 向下取整并返回最终结果
        return Math.floor(baseAttackPower);
    }


    // 计算绿字攻击力 额外加成
    public calculateBonusAttackPower(entity: ECSEntity): number {
        let bonusAttackPower = 0;
        bonusAttackPower += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE);
        // 可能还有其他来源的绿字攻击力，根据需要添加
        return Math.floor(bonusAttackPower);
    }



    //属性攻击力
    private calculateAttributeAttackPower(entity: ECSEntity): number {
        const attributeComponent = entity.getComponent(AttributeComponent);
        const primaryAttribute = attributeComponent.getPrimaryAttribute();

        switch (primaryAttribute) {
            case Attributes.ATTRIBUTE_STRENGTH:
                return this.attributeCalculator.calculateFinalStrength(entity);
            case Attributes.ATTRIBUTE_AGILITY:
                return this.attributeCalculator.calculateFinalAgility(entity);
            case Attributes.ATTRIBUTE_INTELLECT:
                return this.attributeCalculator.calculateFinalIntelligence(entity);
            default:
                return 0;
        }
        
    }



    private checkDamageTypeConversion(entity: ECSEntity, originalType: DamageType): DamageType {
        if (originalType === DamageType.DAMAGE_TYPE_PHYSICAL &&
            this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL) > 0) {
            return DamageType.DAMAGE_TYPE_MAGICAL;
        }
        return originalType;
    }

   


    public calculatePostCritBonusDamage(entity: ECSEntity): number {
        return this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT);
    }


    public calculateProcAttackBonusDamage(entity: ECSEntity, damageType: DamageType): number {
        let bonusDamage = 0;
        switch (damageType) {
            case DamageType.DAMAGE_TYPE_PHYSICAL:
                bonusDamage += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL);
                break;
            case DamageType.DAMAGE_TYPE_MAGICAL:
                bonusDamage += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL);
                break;
            case DamageType.DAMAGE_TYPE_PURE:
                bonusDamage += this.modifierManager.getModifierValue(entity, ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE);
                break;
        }
        return bonusDamage;
    }
    
   
}


// const modifierManager = ModifierManager.getInstance();
// const damageCalculator = new DamageCalculator(modifierManager);

// const attacker = /* 获取攻击者实体 */;
// const target = /* 获取目标实体 */;
// const baseDamage = 100; // 假设基础伤害为100
// const damageType = DamageType.DAMAGE_TYPE_PHYSICAL;

// const finalDamage = damageCalculator.calculateDamage(attacker, target, baseDamage, damageType);
// console.log(`Final damage: ${finalDamage}`);