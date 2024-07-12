// import { AttackComponent } from "./component/AttackComponent";
// import { AttributeComponent } from "./component/AttributeComponent";
// import { DefenseComponent } from "./component/DefenseComponent";
// import { EquipmentComponent } from "./component/EquipmentComponent";
// import { Attribute } from "./enum/Attribute";
// import { ModifierFunction } from "./enum/Modifier";

// export class CombatCalculator {
//      /*************************************************************普通攻击伤害******************************************************************** */

    
    
//     /*************************************************************攻击伤害******************************************************************** */


    

//     //主要攻击力 = 基础攻击力 + 总主属性点 + 技能加成
//     public static calculateAttackDamage(attackComponent: AttackComponent, attributeComponent: AttributeComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
//         let baseAttackDamage = this.calculateBaseAttackDamage(attackComponent,attributeComponent, equipmentComponent, buffComponent)
//         let bonusAttackDamage = this.calculateBonusAttackDamage(equipmentComponent, buffComponent)
//         let mainAttackDamage = baseAttackDamage +  bonusAttackDamage //主要攻击伤害

//         // let mainAttackPercent = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE) +
//         // buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE)


//         return mainAttackDamage
//     }


//     //计算基础攻击伤害 (白字攻击力)
//     public static calculateBaseAttackDamage(attackComponent: AttackComponent, attributeComponent: AttributeComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
//         // 攻击伤害在最小伤害和最大伤害之间的一个随机值
//         let baseAttack = attackComponent.baseAttackDamageMin + Math.random() * (attackComponent.baseAttackDamageMax - attackComponent.baseAttackDamageMin);
//         baseAttack += equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE)
//         baseAttack += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE)
//         let attributeAttackDamage = this.calculateAttributeAttackDamage(attributeComponent,equipmentComponent,buffComponent)
//         // 返回总伤害
//         return baseAttack +attributeAttackDamage;//白字上伤害加成
//     }

//     //计算属性攻击力伤害
//     public static calculateAttributeAttackDamage(attributeComponent: AttributeComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
//         let damage = 0
//         switch (attributeComponent.attributePrimary) {
//             case Attribute.ATTRIBUTE_STRENGTH:
//                 damage = this.calculateStrength(attributeComponent,equipmentComponent,buffComponent);
//             case Attribute.ATTRIBUTE_AGILITY:
//                 damage = this.calculateAgility(attributeComponent,equipmentComponent,buffComponent);
//             case Attribute.ATTRIBUTE_INTELLECT:
//                 damage = this.calculateIntelligence(attributeComponent,equipmentComponent,buffComponent);
//             default:
//                 damage = 0; // 如果主属性未定义，返回0
//         }
//         return damage
//     }

//     //计算攻击力加成伤害(绿字攻击力) //武器等
//     public static calculateBonusAttackDamage(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
//         let bonusAttack = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE)
//         bonusAttack += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE)
//         return bonusAttack  //绿字伤害加成
//     }

    
    
//     //在暴击计算后 添加伤害
//     public static calculateAttackDamageAfterCritialStrike(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent):number{
//         let damage = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT)
//         damage+= buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT)
//         return damage
//     }

//     //计算物理攻击加成  判断为物理攻击后
//     public static calculatePysicalAttackBonusDamage(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent):number{
//         let damage = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL)
//         damage+= buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL)
//         return damage
//     }

//     //计算魔法攻击加成  判断为魔法攻击后
//     public static calculateMagicalAttackBonusDamage(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent):number{
//         let damage = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL)
//         damage+= buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL)
//         return damage
//     }

//     //计算纯粹攻击加成  判断为纯粹攻击后
//     public static calculatePureAttackBonusDamage(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent):number{
//         let damage = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE)
//         damage+= buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE)
//         return damage
//     }

    

   

    

//     /*************************************************************护甲**魔抗****************************************************************** */
    
//     //计算护甲系数
//     public static calculateArmorMultiplier(defenseComponent: DefenseComponent, attributeComponent: AttributeComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent):number{
//         let armorPhysical = this.calculateArmor(defenseComponent,attributeComponent,equipmentComponent,buffComponent)
//         let multiplier = 1 - 0.06 * armorPhysical / (1 + 0.06 * Math.abs(armorPhysical));
//         return multiplier
//     }


//     //计算主要护甲 主要护甲 = 基础护甲 + 敏捷属性护甲 + 技能加成
//     public static calculateArmor(defenseComponent: DefenseComponent, attributeComponent: AttributeComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
//         let baseArmor = this.calculateBaseArmor(defenseComponent, equipmentComponent, buffComponent)
//         let attributeArmor = this.calculateAttributeArmor(attributeComponent, equipmentComponent, buffComponent)
//         let bonusArmor = this.calculateBonusArmor(equipmentComponent, buffComponent)

//         let mainArmor = baseArmor + attributeArmor + bonusArmor

//         let mainArmorPercent = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE) +
//         buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE)

//         return mainArmor *(1+mainArmorPercent)
//     }
  

//     //计算基础护甲
//     public static calculateBaseArmor(defenseComponent: DefenseComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
//         let baseArmor = defenseComponent.armorPhysical
//         let baseArmorPercent = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE) +
//             buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE)
//         return baseArmor * (1 + baseArmorPercent)
//     }

//     //敏捷护甲
//     public static calculateAttributeArmor(attributeComponent: AttributeComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
//         let baseAgility = this.calculateAgility(attributeComponent,equipmentComponent,buffComponent)
//         return baseAgility / 6
//     }

//     //计算额外护甲
//     public static calculateBonusArmor(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent): number {
//         let bonusArmor = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS)
//         bonusArmor += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS)
//         return bonusArmor
//     }


//     public static calculateBaseMagicalResistance(defenseComponent: DefenseComponent, equipmentComponent: EquipmentComponent, buffComponent: BuffComponent){
//         let magicResistance = defenseComponent.magicResistance
//         magicResistance +=equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS)
//         magicResistance += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS)
//         return magicResistance
//     }

    



//      /*************************************************************闪避******************************************************************** */
//     //计算被攻击单位的闪避几率
//     public static calculateEvasion(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent){
//         let evasion = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_EVASION_CONSTANT)
//         evasion += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_EVASION_CONSTANT)
//         return evasion 
//     }

//     //计算己方减少对方闪避几率
//     public static calculateNegativeEvasion(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent){
//         let evasion = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_NEGATIVE_EVASION_CONSTANT)
//         evasion += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_NEGATIVE_EVASION_CONSTANT)
//         return evasion 
//     }

//     /*************************************************************暴击******************************************************************** */
//     //计算暴击倍率
//     public static calculateCriticalStrike(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent){
//         let criticalStrike = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE)
//         criticalStrike += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE)
//         if(criticalStrike == 0 ){
//             return 1
//         }
//         return criticalStrike 
//     }

//     /*************************************************************格挡******************************************************************** */
//     //计算物理伤害格挡
//     public static calculatePhysicalBlock(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent){
//         let block = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK)
//         block += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK)
//         return block 
//     }
//     //计算魔法伤害格挡
//     public static calculateMagicalBlock(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent){
//         let block = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK)
//         block += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK)
//         return block 
//     }
//     //计算所有伤害格挡
//     public static calculateTotalBlock(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent){
//         let block = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK)
//         block += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK)
//         return block 
//     }

//     //在应用护甲前就减少伤害
//     public static calculateBlockBeforeArmor(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent){
//         let block = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK_UNAVOIDABLE_PRE_ARMOR )
//         block += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK_UNAVOIDABLE_PRE_ARMOR )
//         return block 
//     }





//     /*************************************************************攻击速度******************************************************************** */

//     public static calculateAttackRate(attackComponent:AttackComponent,attributeComponent: AttributeComponent,equipmentComponent: EquipmentComponent, buffComponent: BuffComponent):number{
//         let speedPercent = this.calculateAttackSpeedBonusPercent(equipmentComponent,buffComponent) +
//         this.calculateAttributeAttackSpeedPercent(attributeComponent,equipmentComponent,buffComponent)
//         return attackComponent.attackRate/(1+speedPercent) 
//     }

//     public static calculateAttackSpeedBonusPercent(equipmentComponent: EquipmentComponent, buffComponent: BuffComponent):number{
//         let speed = equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT )
//         speed += buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT )
//         return speed/100 
//     }

//     public static calculateAttributeAttackSpeedPercent(attributeComponent: AttributeComponent,equipmentComponent: EquipmentComponent, buffComponent: BuffComponent):number{
//         let agility = this.calculateAgility(attributeComponent,equipmentComponent,buffComponent)
//         let speedPercent = agility*0.1
//         return speedPercent 
//     }

//     /*******************************************************************计算属性******************************************************************** */
//     //计算出敏捷
//     public static calculateAgility(attributeComponent:AttributeComponent,equipmentComponent:EquipmentComponent,buffComponent:BuffComponent):number{
//         let baseAgility = attributeComponent.baseAgility +
//         equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS) +
//         buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS);
//         return baseAgility
//     }
//     //计算出力量
//     public static calculateStrength(attributeComponent:AttributeComponent,equipmentComponent:EquipmentComponent,buffComponent:BuffComponent):number{
//         let baseStrength = attributeComponent.baseStrength +
//         equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS) +
//         buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS);
//         return baseStrength
//     }

//     //计算出智力
//     public static calculateIntelligence(attributeComponent:AttributeComponent,equipmentComponent:EquipmentComponent,buffComponent:BuffComponent):number{
//         let baseIntelligence = attributeComponent.baseIntelligence +
//         equipmentComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_INTELLECT_BONUS) +
//         buffComponent.getModifierMapping().calculateModifierTotalValue(ModifierFunction.MODIFIER_PROPERTY_STATS_INTELLECT_BONUS);
//         return baseIntelligence
//     }

   

// }