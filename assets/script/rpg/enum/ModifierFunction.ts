// 当发生暴击时，暴击倍率会应用在您英雄的基础伤害和绿字伤害上（也就是包括了所有的攻击加成）

// 当发生暴击时，暴击伤害首先应用于基础攻击伤害和加成攻击（绿字）伤害，
// 然后MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE伤害加成应用于暴击所得到的总伤害上。
// 所以，这个修饰符是在暴击之后计算的。
// 护甲的影响在所有伤害修饰（暴击，伤害增加，减伤等）之后最后计算，因此，
// MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE的伤害增加是在护甲系数应用之前计算的。

export enum ModifierFunction{
    // `GetModifierPreAttack_BonusDamage`: 提供在攻击前就有的额外攻击力 ,绿字攻击力，比如武器 攻击力
    MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE = 0,
    

    // `GetModifierPreAttack_BonusDamagePostCrit`: 暴击后再添加一个伤害
    MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT = 3,

    // `GetModifierBaseAttack_BonusDamage`: 获取到基础攻击额外的伤害。 直接增加基础攻击力，一般是技能buff
    MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE = 4,



     // `GetModifierProcAttack_BonusDamage_Physical`: 获取物理伤害的攻击加成。  在特定条件下触发，造成额外的一次性物理伤害。在设计游戏内物品和技能时需要考虑这些不同的属性，来达到预期的效果
     MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL = 5,

     // `GetModifierProcAttack_ConvertPhysicalToMagical`: 将物理伤害转变为魔法伤害。
     MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL = 6,
 
     // `GetModifierProcAttack_BonusDamage_Magical`: 获取魔法伤害的攻击加成。
     MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL = 7,
 
     /**
     * 方法名称：`GetModifierProcAttack_BonusDamage_Pure`
     * 这个方法会返回修饰器提供的纯粹伤害攻击加成。
     */
     MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE = 8,


    /**********************************提升百分比******************************** */

     // `GetModifierBonusDamageOutgoing_Percentage`: 改变单位造成的额外伤害的百分比。
     MODIFIER_PROPERTY_BONUSDAMAGEOUTGOING_PERCENTAGE = 40,

     // `GetModifierDamageOutgoing_Percentage`: 改变单位造成的总伤害的百分比。
     MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE = 41,

      // `GetModifierTotalDamageOutgoing_Percentage`: 获取单位造成的总伤害的百分比。
      MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE = 44,
 
     // `GetModifierDamageOutgoing_Percentage_Illusion`: 改变幻影造成的伤害的百分比。
     MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION = 42,
 
     // `GetModifierDamageOutgoing_Percentage_Illusion_Amplify`: 提高幻影造成的伤害的百分比。
     MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION_AMPLIFY = 43,


    /*****************************影响属性***************************************** */


     MODIFIER_PROPERTY_STATS_STRENGTH_BONUS = 100,


     // `GetModifierBonusStats_Agility`: 增加敏捷属性的值。
     MODIFIER_PROPERTY_STATS_AGILITY_BONUS = 101,
 
     // `GetModifierBonusStats_Intellect`: 增加智力属性的值。
     MODIFIER_PROPERTY_STATS_INTELLECT_BONUS = 102,
 
     // `GetModifierBonusStats_Strength_Percentage`: 按百分比增加力量属性的值。
     MODIFIER_PROPERTY_STATS_STRENGTH_BONUS_PERCENTAGE = 103,
 
     // `GetModifierBonusStats_Agility_Percentage`: 按百分比增加敏捷属性的值。
     MODIFIER_PROPERTY_STATS_AGILITY_BONUS_PERCENTAGE = 104,
 
     // `GetModifierBonusStats_Intellect_Percentage`: 按百分比增加智力属性的值。
     MODIFIER_PROPERTY_STATS_INTELLECT_BONUS_PERCENTAGE = 105,
 
    /******************************护甲**************************************** */

       // `GetModifierPhysicalArmorBase_Percentage`: 提供基础物理护甲的增加百分比。
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE = 71,
    /**
     * 方法名称：`GetModifierPhysicalArmorTotal_Percentage`
     * 此方法返回物理护甲总的百分比修改值。
     */
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE = 72,

     /**
      * 方法名称：`GetModifierPhysicalArmorBonus`
      * 此方法返回由修改器添加的额外物理护甲。
      */
     MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS = 73,


     // `GetModifierMagicalResistanceBonus`: 提供额外的魔法抗性加成。
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS = 81,


    /******************************闪避**************************************** */

     // `GetModifierEvasion_Constant`: 提供常规的闪避率。
     MODIFIER_PROPERTY_EVASION_CONSTANT = 63,

     // `GetModifierNegativeEvasion_Constant`: 提供负的闪避率。
     MODIFIER_PROPERTY_NEGATIVE_EVASION_CONSTANT = 64,


    /******************************暴击**************************************** */
      /**
     * 方法名称：`GetModifierPreAttack_CriticalStrike`
     * 此方法返回预设的攻击暴击率。
     */
    MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE = 134,


    /******************************格挡**************************************** */

        /**
     * 方法名称：`GetModifierMagical_ConstantBlock`
     * 此方法返回对魔法伤害的固定格挡值。
     */
        MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK = 136,

        /**
         * 方法名称：`GetModifierPhysical_ConstantBlock`
         * 此方法返回对物理伤害的固定格挡值。
         */
        MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK = 137,
    
        
    
        /**
         * 方法名称：`GetModifierPhysical_ConstantBlockUnavoidablePreArmor`
         * 此方法返回防止任何护甲前的应对物理伤害的固定格挡值。
         */
        MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK_UNAVOIDABLE_PRE_ARMOR = 139,
    
        /**
         * 方法名称：`GetModifierTotal_ConstantBlock`
         * 此方法返回对全部伤害的固定格挡值。
         */
        MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK = 140,


    /****************************攻击速度**************************************** */
     /**
     * 方法名称：`GetModifierAttackSpeedBonus_Constant`
     * 这个方法将返回一个恒定的攻击速度加成数值。
     */
    MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT = 31,

         // `GetModifierBaseAttackTimeConstant`: 获取单位的基础攻击间隔。
    MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT = 36,

    // `GetModifierBaseAttackTimeConstant_Adjust`: 调整单位的基础攻击间隔。
    MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT_ADJUST = 37,

    // `GetModifierBaseAttackTimePercentage`: 以百分比改变单位的基础攻击间隔。
    MODIFIER_PROPERTY_BASE_ATTACK_TIME_PERCENTAGE = 38,

    // `GetModifierAttackSpeedBaseOverride`: 获取基础攻击速度的加成。
    MODIFIER_PROPERTY_ATTACKSPEED_BASE_OVERRIDE = 29,

    // `GetModifierFixedAttackRate`: 获取单位固定的攻击速度。
    MODIFIER_PROPERTY_FIXED_ATTACK_RATE = 30,

    // `GetModifierAttackSpeed_Limit`: 这个方法应该类似于忽略最大攻击速度限制。
    MODIFIER_PROPERTY_IGNORE_ATTACKSPEED_LIMIT = 32,


     /****************************移动速度**************************************** */

        /**
     * 方法名称：`GetModifierMoveSpeedBonus_Constant`
     * 这个方法返回一个固定的移动速度加成。
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT = 16,

    /**
     * 方法名称：`GetModifierMoveSpeedOverride`
     * 这个方法可以覆盖单位的基础移动速度。
     */
    MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE = 17,

    /**
     * 方法名称：`GetModifierMoveSpeedBonus_Percentage`
     * 这个方法返回一个百分比形式的移动速度加成。
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE = 18,

    /**
     * 方法名称：`GetModifierMoveSpeedBonus_Percentage_Unique`
     * 这个方法返回一个独特的移动速度百分比加成，不和其他百分比移动速度加成堆叠，只取最大的那个值。
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE = 19,

    /**
     * 方法名称：`GetModifierMoveSpeedBonus_Special_Boots`
     * 这个方法会返回一个独特的移动速度加成，常常用于特殊的鞋类物品。
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE = 20,

    /**
     * 方法名称：`GetModifierMoveSpeedBonus_Special_Boots_2`
     * 此方法是对上述鞋类移动速度加成属性的补充，用于情况复杂或需要更多控制的物品。
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE_2 = 21,

    /**
     * 方法名称：`GetModifierMoveSpeedBonus_Constant_Unique`
     * 这个方法返回一个独特的固定值移动速度加成，它只应用最大的那个固定值加成。
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE = 22,

    /**
     * 方法名称：`GetModifierMoveSpeedBonus_Constant_Unique_2`
     * 这个方法是对上述独特的固定值移动速度加成的补充,它是另一种特殊固定值加成.
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE_2 = 23,

    /**
     * 方法名称：`GetModifierMoveSpeed_Absolute`
     * 这个方法会设定单位的移动速度为一个绝对值，无视所有其他移动速度加成或减少。
     */
    MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE = 24,

    /**
     * 方法名称：`GetModifierMoveSpeed_AbsoluteMin`
     * 这个方法可以设定一个移动速度的绝对最小值，单位的移动速度不会低于这个数值。
     */
    MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN = 25,

    /**
     * 方法名称：`GetModifierMoveSpeed_AbsoluteMax`
     * 这个方法可以设定一个移动速度的绝对最大值，单位的移动速度不会超过这个数值。
     */
    MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MAX = 26,

    /**
     * 方法名称：`GetModifierIgnoreMovespeedLimit`
     * 如果这个方法返回真，单位的移动速度将忽视游戏默认的350-550的移动速度限制，可以超过这个范围。
     */
    MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT = 27,

    /**
     * 方法名称：`GetModifierMoveSpeed_Limit`
     * 这个方法可以设定一个移动速度上限，单位的移动速度不会超过这个数值。
     */
    MODIFIER_PROPERTY_MOVESPEED_LIMIT = 28,

}
