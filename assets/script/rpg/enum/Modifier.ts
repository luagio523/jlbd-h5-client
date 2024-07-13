

 




export enum ModifierAttribute {
  MODIFIER_ATTRIBUTE_NONE = 0, // 无特性。默认情况下，Modifier不具有任何属性。
  MODIFIER_ATTRIBUTE_PERMANENT = 1 << 0, // 永久性。Modifier不会被驱散。
  MODIFIER_ATTRIBUTE_MULTIPLE = 1 << 1,// 可叠加。允许多个相同的Modifier存在于一个单位上。允许多个相同的Modifier实例同时存在于一个单位上.  每个Modifier实例是独立的，有自己的持续时间和效果.通常用于可以多次施加的buff或debuff，每次施加都会创建一个新的实例

  MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE = 1 << 2,// 忽略无敌。在施加Modifier时，会忽略目标单位的无敌状态。
  MODIFIER_ATTRIBUTE_AURA_PRIORITY = 1 << 3,// 光环优先。在排序Modifier列表时，光环Modifier将总是排在非光环Modifier前面。
  MODIFIER_ATTRIBUTE_IGNORE_DODGE = 1 << 4,// 忽略闪避。Modifier的效果不会被目标单位的闪避能力或异界混沌骑士的幻象效果影响。
  MODIFIER_ATTRIBUTE_HIDDEN = 1 << 5,
  MODIFIER_ATTRIBUTE_REMOVE_ON_DEATH = 1 << 6,
  MODIFIER_ATTRIBUTE_IGNORE_TENACITY = 1 << 7,
  MODIFIER_ATTRIBUTE_STACKABLE = 1 << 8,  //允许同一个Modifier的效果进行叠加，但只存在一个Modifier实例
  MODIFIER_ATTRIBUTE_REFRESH_ON_STACK = 1 << 9,
  MODIFIER_ATTRIBUTE_UNIQUE = 1 << 10,
}









export enum D2ModifierFunction {
    // `GetModifierPreAttack_BonusDamage`: 提供一直生效的额外攻击力 ,绿字攻击力
    MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE = 0,

    // `GetModifierPreAttack_BonusDamage_Target`: Hero在攻击特定目标前获取额外的伤害。
    MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET = 1,

    // `GetModifierPreAttack_BonusDamage_Proc`: Hero在攻击被处理之前获取额外的伤害。
    MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PROC = 2,

    // `GetModifierPreAttack_BonusDamagePostCrit`: 伤害会在攻击后的暴击伤害计算后被考虑进去。
    MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT = 3,

    // `GetModifierBaseAttack_BonusDamage`: 获取到基础攻击额外的伤害。 直接增加基础攻击力
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

    /**
     * 方法名称：`GetModifierProcAttack_BonusDamage_Magical_Target`
     * 这个方法返回修饰器提供的对魔法伤害攻击目标的加成。
     */
    MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL_TARGET = 9,

    /**
     * 方法名称：`GetModifierProcAttack_Feedback`
     * 攻击反馈处理函数的返回值。
     */
    MODIFIER_PROPERTY_PROCATTACK_FEEDBACK = 10,

    /**
     * 方法名称：`GetModifierOverrideAttackDamage`
     * 这个方法返回一个值作为攻击伤害的上限。
     */
    MODIFIER_PROPERTY_OVERRIDE_ATTACK_DAMAGE = 11,

    /**
     * 方法名称：`GetModifierPreAttack`
     */
    MODIFIER_PROPERTY_PRE_ATTACK = 12,

    /**
     * 方法名称：`GetModifierInvisibilityLevel`
     * 此方法控制单位的隐身等级。级别越高，单位越难以被侦测。
     */
    MODIFIER_PROPERTY_INVISIBILITY_LEVEL = 13,

    /**
     * 方法名称：`GetModifierInvisibilityAttackBehaviorException`
     * 该方法如果返回真，则允许单位在隐形状态下攻击或使用技能而不会破坏隐形效果。
     */
    MODIFIER_PROPERTY_INVISIBILITY_ATTACK_BEHAVIOR_EXCEPTION = 14,

    /**
     * 方法名称：`GetModifierPersistentInvisibility`
     * 如果值为真，单位会一直保持隐身，直到该修饰符被移除。
     */
    MODIFIER_PROPERTY_PERSISTENT_INVISIBILITY = 15,

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

    // `GetModifierAttackSpeedBaseOverride`: 获取基础攻击速度的加成。
    MODIFIER_PROPERTY_ATTACKSPEED_BASE_OVERRIDE = 29,

    // `GetModifierFixedAttackRate`: 获取单位固定的攻击速度。
    MODIFIER_PROPERTY_FIXED_ATTACK_RATE = 30,

    /**
     * 方法名称：`GetModifierAttackSpeedBonus_Constant`
     * 这个方法将返回一个恒定的攻击速度加成数值。
     */
    MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT = 31,

    // `GetModifierAttackSpeed_Limit`: 这个方法应该类似于忽略最大攻击速度限制。
    MODIFIER_PROPERTY_IGNORE_ATTACKSPEED_LIMIT = 32,

    // `GetModifierCooldownReduction_Constant`: 获取技能冷却时间的减少量。
    MODIFIER_PROPERTY_COOLDOWN_REDUCTION_CONSTANT = 33,

    // `GetModifierManacostReduction_Constant`: 获取法力消耗的减少量。
    MODIFIER_PROPERTY_MANACOST_REDUCTION_CONSTANT = 34,

    // `GetModifierHealthcostReduction_Constant`: 获取技能消耗生命值的减少量。
    MODIFIER_PROPERTY_HEALTHCOST_REDUCTION_CONSTANT = 35,

    // `GetModifierBaseAttackTimeConstant`: 获取单位的基础攻击间隔。
    MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT = 36,

    // `GetModifierBaseAttackTimeConstant_Adjust`: 调整单位的基础攻击间隔。
    MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT_ADJUST = 37,

    // `GetModifierBaseAttackTimePercentage`: 以百分比改变单位的基础攻击间隔。
    MODIFIER_PROPERTY_BASE_ATTACK_TIME_PERCENTAGE = 38,

    // `GetModifierAttackPointConstant`: 调整单位的攻击触发点。
    MODIFIER_PROPERTY_ATTACK_POINT_CONSTANT = 39,

    // `GetModifierBonusDamageOutgoing_Percentage`: 改变单位造成的额外伤害的百分比。
    MODIFIER_PROPERTY_BONUSDAMAGEOUTGOING_PERCENTAGE = 40,

    // `GetModifierDamageOutgoing_Percentage`: 改变单位造成的总伤害的百分比。
    MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE = 41,

    // `GetModifierDamageOutgoing_Percentage_Illusion`: 改变幻影造成的伤害的百分比。
    MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION = 42,

    // `GetModifierDamageOutgoing_Percentage_Illusion_Amplify`: 提高幻影造成的伤害的百分比。
    MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION_AMPLIFY = 43,

    // `GetModifierTotalDamageOutgoing_Percentage`: 获取单位造成的总伤害的百分比。
    MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE = 44,

    // `GetModifierSpellAmplify_PercentageCreep`: 提高Creep的法术伤害的百分比。
    MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_CREEP = 45,

    // `GetModifierSpellAmplify_Percentage`: 提高单位的法术伤害的百分比。
    MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE = 46,

    /**
     * 方法名称：`GetModifierSpellAmplify_PercentageUnique`
     * 此方法返回一个独特的法术增幅百分比。它不会与其他百分比叠加，只会应用最大的值。
     */
    MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_UNIQUE = 47,

    /**
     * 方法名称：`GetModifierHealAmplify_PercentageSource`
     * 此方法返回单位治疗自身的百分比增强值。
     */
    MODIFIER_PROPERTY_HEAL_AMPLIFY_PERCENTAGE_SOURCE = 48,

    /**
     * 方法名称：`GetModifierHealAmplify_PercentageTarget`
     * 此方法返回单位治疗目标的百分比增强值。
     */
    MODIFIER_PROPERTY_HEAL_AMPLIFY_PERCENTAGE_TARGET = 49,

    /**
     * 方法名称：`GetModifierHPRegen_CanBeNegative`
     * 如果返回真，此方法允许单位的生命回复被减少到负数，从而导致单位持续损失生命。
     */
    MODIFIER_PROPERTY_HP_REGEN_CAN_BE_NEGATIVE = 50,
    // `GetModifierHPRegenAmplify_Percentage`: 提高单位治疗效果的百分比。
    MODIFIER_PROPERTY_HP_REGEN_AMPLIFY_PERCENTAGE = 51,

    // `GetModifierLifestealRegenAmplify_Percentage`: 提高单位的吸血效果的百分比。
    MODIFIER_PROPERTY_LIFESTEAL_AMPLIFY_PERCENTAGE = 52,

    /**
     * 方法名称：`GetModifierSpellLifestealRegenAmplify_Percentage`
     * 此方法返回法术吸血的增幅百分比数值。
     */
    MODIFIER_PROPERTY_SPELL_LIFESTEAL_AMPLIFY_PERCENTAGE = 53,

    // `GetModifierMPRegenAmplify_Percentage`: 提高单位的法力恢复速度的百分比。
    MODIFIER_PROPERTY_MP_REGEN_AMPLIFY_PERCENTAGE = 54,



    /**
     * Method Name: `GetModifierManaDrainAmplify_Percentage`
     * 用于获取当前人物的魔法吸取增幅的百分比
     * 返回类型为浮点数，代表增幅的百分比。
     */
    MODIFIER_PROPERTY_MANA_DRAIN_AMPLIFY_PERCENTAGE = 55,

    /**
     * Total amplify value is clamped to 0.
     *
     *
     * Method Name: `GetModifierMPRestoreAmplify_Percentage`
     * 用于获取当前人物的魔法恢复增幅的百分比。
     * 返回类型为浮点数，代表增幅的百分比。
     * 总增幅值在0上面进行了限制。
     */
    MODIFIER_PROPERTY_MP_RESTORE_AMPLIFY_PERCENTAGE = 56,

    /**
     * Method Name: `GetModifierBaseDamageOutgoing_Percentage`
     * 用于获取当前人物的基础输出伤害增幅的百分比。
     * 返回类型为浮点数，代表增幅的百分比。
     */
    MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE = 57,

    /**
     * Method Name: `GetModifierBaseDamageOutgoing_PercentageUnique`
     * 用于获取当前人物的独特基础输出伤害增幅的百分比。
     * 返回类型为浮点数，代表增幅的百分比。
     */
    MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE_UNIQUE = 58,

    // `GetModifierIncomingDamage_Percentage`: 改变单位受到的伤害的百分比。
    MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE = 59,

    // `GetModifierIncomingPhysicalDamage_Percentage`: 改变单位受到的物理伤害的百分比。
    MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE = 60,
    // `GetModifierIncomingPhysicalDamageConstant`: 控制怪物在防御中承受的物理伤害。客户端返回防护值，服务器返回阻挡的伤害值。
    MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_CONSTANT = 61,

    // `GetModifierIncomingSpellDamageConstant`: 控制怪物在防御中承受的魔法伤害。客户端返回防御值，服务器返回阻挡的伤害值。
    MODIFIER_PROPERTY_INCOMING_SPELL_DAMAGE_CONSTANT = 62,

    // `GetModifierEvasion_Constant`: 提供常规的闪避率。
    MODIFIER_PROPERTY_EVASION_CONSTANT = 63,

    // `GetModifierNegativeEvasion_Constant`: 提供负的闪避率。
    MODIFIER_PROPERTY_NEGATIVE_EVASION_CONSTANT = 64,

    // `GetModifierStatusResistance`: 改变怪物的状态抗性。
    MODIFIER_PROPERTY_STATUS_RESISTANCE = 65,

    // `GetModifierStatusResistanceStacking`: 改变怪物的堆叠状态抗性。
    MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING = 66,
    /**
     * 方法名称：`GetModifierStatusResistanceCaster`
     * 此方法返回施法者的状态格挡的修改值。
     */
    MODIFIER_PROPERTY_STATUS_RESISTANCE_CASTER = 67,

    // `GetModifierAvoidDamage`: 控制单位是否可以免疫某些类型的伤害。
    MODIFIER_PROPERTY_AVOID_DAMAGE = 68,

    // `GetModifierAvoidSpell`: 控制单位是否可以免疫魔法攻击。
    MODIFIER_PROPERTY_AVOID_SPELL = 69,

    // `GetModifierMiss_Percentage`: 提供减少命中几率的百分比。
    MODIFIER_PROPERTY_MISS_PERCENTAGE = 70, 

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

    /**
     * 方法名称：`GetModifierPhysicalArmorBonusUnique`
     * 该方法返回独特的物理护甲加成。这并不与其他加成叠加，只适用最高值。
     */
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE = 74,

    /**
     * 方法名称：`GetModifierPhysicalArmorBonusUniqueActive`
     * 只在修饰符激活时适用。它返回物理护甲的独特加成。
     */
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE = 75,

    /**
     * 方法名称：`GetModifierPhysicalArmorBonusPost`
     * 此方法返回物理护甲的加成，但在所有其他加成和减少后计算。
     */
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_POST = 76,

    /**
     * 方法名称：`GetModifierMinPhysicalArmor`
     * 这为单位的物理护甲设置了一个最小值。 最终护甲不能低于此数值。
     */
    MODIFIER_PROPERTY_MIN_PHYSICAL_ARMOR = 77,

    /**
     * 方法名称：`GetModifierIgnorePhysicalArmor`
     * 如果为正，此方法会使单位忽略其目标的物理护甲。
     */
    MODIFIER_PROPERTY_IGNORE_PHYSICAL_ARMOR = 78,

    // `GetModifierMagicalResistanceBaseReduction`: 提供基础魔法抗性的降低。
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BASE_REDUCTION = 79,
    /**
     * 方法名称：`GetModifierMagicalResistanceDirectModification`
     * 此方法返回魔法格挡的直接修改值。
     */
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DIRECT_MODIFICATION = 80,

    // `GetModifierMagicalResistanceBonus`: 提供额外的魔法抗性加成。
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS = 81,
    /**
         * 方法名称：`GetModifierMagicalResistanceBonusIllusions`
         * 此方法返回幻影魔法格挡的加值。
         */
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS_ILLUSIONS = 82,

    /**
     * 方法名称：`GetModifierMagicalResistanceBonusUnique`
     * 此方法返回独特魔法格挡的加值。
     */
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS_UNIQUE = 83,

    /**
     * 方法名称：`GetModifierMagicalResistanceDecrepifyUnique`
     * 此方法返回独特魔法减值格挡的削减值。
     */
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE = 84,

    /**
     * 方法名称：`GetModifierBaseRegen`
     * 此方法返回基础魔力再生值的修改值。
     */
    MODIFIER_PROPERTY_BASE_MANA_REGEN = 85,

    /**
     * 方法名称：`GetModifierConstantManaRegen`
     * 此方法返回稳定魔力再生的修改值。
     */
    MODIFIER_PROPERTY_MANA_REGEN_CONSTANT = 86,

    /**
     * 方法名称：`GetModifierConstantManaRegenUnique`
     * 此方法返回独特稳定魔力再生的修改值。
     */
    MODIFIER_PROPERTY_MANA_REGEN_CONSTANT_UNIQUE = 87,

    /**
     * 方法名称：`GetModifierTotalPercentageManaRegen`
     * 此方法返回魔力再生总百分比的修改值。
     */
    MODIFIER_PROPERTY_MANA_REGEN_TOTAL_PERCENTAGE = 88,

    /**
     * 方法名称：`GetModifierConstantHealthRegen`
     * 此方法返回稳定生命值再生的修改值。
     */
    MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT = 89,

    /**
     * 方法名称：`GetModifierHealthRegenPercentage`
     * 此方法返回生命值再生百分比的修改值。
     */
    MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE = 90,

    /**
     * 方法名称：`GetModifierHealthRegenPercentageUnique`
     * 此方法返回独特生命值再生百分比的修改值。
     */
    MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE_UNIQUE = 91,

    // `GetModifierHealthBonus`: 增加额外的生命值。
    MODIFIER_PROPERTY_HEALTH_BONUS = 92,

    // `GetModifierManaBonus`: 增加额外的法力值。
    MODIFIER_PROPERTY_MANA_BONUS = 93,

    // `GetModifierExtraStrengthBonus`: 提供额外的力量加成。
    MODIFIER_PROPERTY_EXTRA_STRENGTH_BONUS = 94,

    /**
     * 方法名称：`GetModifierExtraHealthBonus`
     * 此方法返回额外生命值的加值。
     */
    MODIFIER_PROPERTY_EXTRA_HEALTH_BONUS = 95,

    /**
     * 方法名称：`GetModifierExtraManaBonus`
     * 此方法返回额外魔力的加值。
     */
    MODIFIER_PROPERTY_EXTRA_MANA_BONUS = 96,

    /**
     * 方法名称：`GetModifierExtraManaBonusPercentage`
     * 此方法返回魔力的额外百分比加值。
     */
    MODIFIER_PROPERTY_EXTRA_MANA_BONUS_PERCENTAGE = 97,

    /**
     * 方法名称：`GetModifierExtraHealthPercentage`
     * 此方法返回生命值的额外百分比加值。
     */
    MODIFIER_PROPERTY_EXTRA_HEALTH_PERCENTAGE = 98,

    /**
     * 方法名称：`GetModifierExtraManaPercentage`
     * 此方法返回魔力的额外百分比加值。
     */
    MODIFIER_PROPERTY_EXTRA_MANA_PERCENTAGE = 99,

    /**
     * 方法名称：`GetModifierBonusStats_Strength`
     * 提供额外的力量加成的统计数据。
     */
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

    // `GetModifierCastRangeBonus`: 增加施法距离。
    MODIFIER_PROPERTY_CAST_RANGE_BONUS = 106,

    // `GetModifierCastRangeBonusPercentage`: 按百分比增加施法距离。
    MODIFIER_PROPERTY_CAST_RANGE_BONUS_PERCENTAGE = 107,


    /**
     * 方法名称：`GetModifierAttackRangeOverride`
     * 此方法返回攻击范围基础值的替代值。
     */
    MODIFIER_PROPERTY_ATTACK_RANGE_BASE_OVERRIDE = 110,

    /**
     * 方法名称：`GetModifierAttackRangeBonus`
     * 此方法返回攻击范围的加值。
     */
    MODIFIER_PROPERTY_ATTACK_RANGE_BONUS = 111,

    /**
     * 方法名称：`GetModifierAttackRangeBonusUnique`
     * 此方法返回独特的攻击范围加值。
     */
    MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_UNIQUE = 112,

    /**
     * 方法名称：`GetModifierAttackRangeBonusPercentage`
     * 此方法返回攻击范围的加值百分比。
     */
    MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_PERCENTAGE = 113,

    /**
     * 方法名称：`GetModifierMaxAttackRange`
     * 此方法返回最大攻击范围。
     */
    MODIFIER_PROPERTY_MAX_ATTACK_RANGE = 114,

    /**
     * 方法名称：`GetModifierProjectileSpeedBonus`
     * 此方法返回投射物速度的加值。
     */
    MODIFIER_PROPERTY_PROJECTILE_SPEED_BONUS = 115,

    /**
     * 方法名称：`GetModifierProjectileSpeedBonusPercentage`
     * 此方法返回投射物速度的加值百分比。
     */
    MODIFIER_PROPERTY_PROJECTILE_SPEED_BONUS_PERCENTAGE = 116,

    /**
     * 方法名称：`GetModifierProjectileName`
     * 此方法返回投射物的名称。
     */
    MODIFIER_PROPERTY_PROJECTILE_NAME = 117,

    /**
     * 方法名称：`ReincarnateTime`
     * 此方法指示复活时间。
     */
    MODIFIER_PROPERTY_REINCARNATION = 118,

    /**
     * 方法名称：`ReincarnateSuppressFX`
     * 此方法指示复活效果应被抑制。
     */
    MODIFIER_PROPERTY_REINCARNATION_SUPPRESS_FX = 119,

    /**
     * 方法名称：`GetModifierConstantRespawnTime`
     * 此方法返回恒定的重生时间。
     */
    MODIFIER_PROPERTY_RESPAWNTIME = 120,

    /**
       * 方法名称：`GetModifierPercentageRespawnTime`
       * 此方法返回重生时间百分比的加值。
       */
    MODIFIER_PROPERTY_RESPAWNTIME_PERCENTAGE = 121,

    /**
     * 方法名称：`GetModifierStackingRespawnTime`
     * 此方法返回堆叠的重生时间加值。
     */
    MODIFIER_PROPERTY_RESPAWNTIME_STACKING = 122,

    /**
     * 方法名称：`GetModifierPercentageCooldown`
     * 此方法返回冷却时间百分比的加值。
     */
    MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE = 123,

    /**
     * 方法名称：`GetModifierPercentageCooldownOngoing`
     * 此方法返回正在进行的冷却时间百分比的加值。
     */
    MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE_ONGOING = 124,

    /**
     * 方法名称：`GetModifierPercentageCasttime`
     * 此方法返回施法时间百分比的加值。
     */
    MODIFIER_PROPERTY_CASTTIME_PERCENTAGE = 125,

    /**
     * 方法名称：`GetModifierPercentageAttackAnimTime`
     * 此方法返回攻击动画时间百分比的加值。
     */
    MODIFIER_PROPERTY_ATTACK_ANIM_TIME_PERCENTAGE = 126,

    /**
     * 方法名称：`GetModifierPercentageManacost`
     * 此方法返回魔力消耗百分比的加值。
     */
    MODIFIER_PROPERTY_MANACOST_PERCENTAGE = 127,

    /**
     * 方法名称：`GetModifierPercentageManacostStacking`
     * 此方法返回堆叠的魔力消耗百分比的加值。
     */
    MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING = 128,

    /**
     * 方法名称：`GetModifierPercentageHealthcost`
     * 此方法返回生命值消耗百分比的加值。
     */
    MODIFIER_PROPERTY_HEALTHCOST_PERCENTAGE = 129,

    /**
     * 方法名称：`GetModifierPercentageHealthcostStacking`
     * 此方法返回堆叠的生命值消耗百分比的加值。
     */
    MODIFIER_PROPERTY_HEALTHCOST_PERCENTAGE_STACKING = 130,

    /**
      * 方法名称：`GetModifierConstantDeathGoldCost`
      * 此方法返回死亡金币损失的固定值。
      */
    MODIFIER_PROPERTY_DEATHGOLDCOST = 131,

    /**
     * 方法名称：`GetModifierPercentageExpRateBoost`
     * 此方法返回经验获取速率提升的百分比。
     */
    MODIFIER_PROPERTY_EXP_RATE_BOOST = 132,

    /**
     * 方法名称：`GetModifierPercentageGoldRateBoost`
     * 此方法返回金币收入提升的百分比。
     */
    MODIFIER_PROPERTY_GOLD_RATE_BOOST = 133,

    /**
     * 方法名称：`GetModifierPreAttack_CriticalStrike`
     * 此方法返回预设的攻击暴击率。
     */
    MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE = 134,

    /**
     * 方法名称：`GetModifierPreAttack_Target_CriticalStrike`
     * 此方法返回预设的针对目标的攻击暴击率。
     */
    MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE = 135,

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
     * 方法名称：`GetModifierPhysical_ConstantBlockSpecial`
     * 此方法返回特殊的对物理伤害的固定格挡值。
     */
    MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK_SPECIAL = 138,

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
    /**
     * 方法名称：`GetOverrideAnimationWeight`
     * 此方法返回覆盖动画权重的值。
     */
    MODIFIER_PROPERTY_OVERRIDE_ANIMATION_WEIGHT = 142,

    /**
     * 方法名称：`GetOverrideAnimationRate`
     * 此方法返回覆盖动画速度的值。
     */
    MODIFIER_PROPERTY_OVERRIDE_ANIMATION_RATE = 143,

    /**
     * 方法名称：`GetAbsorbSpell`
     * 此方法返回吸收法术的特性。
     */
    MODIFIER_PROPERTY_ABSORB_SPELL = 144,

    /**
     * 方法名称：`GetReflectSpell`
     * 此方法返回反射法术的特性。
     */
    MODIFIER_PROPERTY_REFLECT_SPELL = 145,

    /**
     * 方法名称：`GetDisableAutoAttack`
     * 此方法返回禁用自动攻击的特性。
     */
    MODIFIER_PROPERTY_DISABLE_AUTOATTACK = 146,

    /**
     * 方法名称：`GetBonusDayVision`
     * 此方法返回白天视野的加值。
     */
    MODIFIER_PROPERTY_BONUS_DAY_VISION = 147,

    /**
     * 方法名称：`GetBonusDayVisionPercentage`
     * 此方法返回白天视野的加值百分比。
     */
    MODIFIER_PROPERTY_BONUS_DAY_VISION_PERCENTAGE = 148,

    /**
     * 方法名称：`GetBonusNightVision`
     * 此方法返回夜晚视野的加值。
     */
    MODIFIER_PROPERTY_BONUS_NIGHT_VISION = 149,

    /**
     * 方法名称：`GetBonusNightVisionUnique`
     * 此方法返回独特的夜晚视野的加值。
     */
    MODIFIER_PROPERTY_BONUS_NIGHT_VISION_UNIQUE = 150,

    /**
     * 方法名称：`GetBonusVisionPercentage`
     * 此方法返回视野的加值百分比。
     */
    MODIFIER_PROPERTY_BONUS_VISION_PERCENTAGE = 151,

    /**
     * 方法名称：`GetFixedDayVision`
     * 此方法返回固定的白天视野。
     */
    MODIFIER_PROPERTY_FIXED_DAY_VISION = 152,

    /**
     * 方法名称：`GetFixedNightVision`
     * 此方法返回固定的夜晚视野。
     */
    MODIFIER_PROPERTY_FIXED_NIGHT_VISION = 153,

    /**
     * 方法名称：`GetMinHealth`
     * 此方法返回最小生命值的加值。
     */
    MODIFIER_PROPERTY_MIN_HEALTH = 154,

    /**
     * 方法名称：`GetAbsoluteNoDamagePhysical`
     * 此方法返回对物理伤害绝对免疫的特性。
     */
    MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL = 155,

    /**
     * 方法名称：`GetAbsoluteNoDamageMagical`
     * 此方法返回对魔法伤害绝对免疫的特性。
     */
    MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_MAGICAL = 156,

    /**
     * 方法名称：`GetAbsoluteNoDamagePure`
     * 此方法返回对纯粹伤害绝对免疫的特性。
     */
    MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE = 157,

    /**
     * 方法名称：`GetIsIllusion`
     * 此方法返回是否为幻象的特性。
     */
    MODIFIER_PROPERTY_IS_ILLUSION = 158,

    /**
     * 方法名称：`GetModifierIllusionLabel`
     * 此方法返回幻象的标签属性。
     */
    MODIFIER_PROPERTY_ILLUSION_LABEL = 159,

    /**
     * 方法名称：`GetModifierStrongIllusion`
     * 此方法返回强大幻象的特性。
     */
    MODIFIER_PROPERTY_STRONG_ILLUSION = 160,
    /**
         * 方法名称：`GetModifierSuperIllusion`
         * 此方法返回超级幻象的特性。
         */
    MODIFIER_PROPERTY_SUPER_ILLUSION = 161,

    /**
     * 方法名称：`GetModifierSuperIllusionWithUltimate`
     * 此方法返回拥有终极技能的超级幻象的特性。
     */
    MODIFIER_PROPERTY_SUPER_ILLUSION_WITH_ULTIMATE = 162,

    /**
     * 方法名称：`GetModifierXPDuringDeath`
     * 此方法返回死亡时仍然获得经验的特性。
     */
    MODIFIER_PROPERTY_XP_DURING_DEATH = 163,

    /**
     * 方法名称：`GetModifierTurnRate_Percentage`
     * 此方法返回转身速度百分比的加值。
     */
    MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE = 164,

    /**
     * 方法名称：`GetModifierTurnRate_Override`
     * 此方法返回覆盖转身速度的加值。
     */
    MODIFIER_PROPERTY_TURN_RATE_OVERRIDE = 165,

    // `GetDisableHealing`: 禁止一切治疗效果作用于单位。
    MODIFIER_PROPERTY_DISABLE_HEALING = 166,
    // `GetAlwaysAllowAttack`: 允许单位在任何情况下攻击，包括通常限制攻击的情况。
    MODIFIER_PROPERTY_ALWAYS_ALLOW_ATTACK = 167,

    // `GetAllowEtherealAttack`: 允许单位在虚无状态下攻击。
    MODIFIER_PROPERTY_ALWAYS_ETHEREAL_ATTACK = 168,

    // `GetOverrideAttackMagical`: 单位的攻击被视为魔法攻击。
    MODIFIER_PROPERTY_OVERRIDE_ATTACK_MAGICAL = 169,

    // `GetModifierUnitStatsNeedsRefresh`: 单位属性（力量、敏捷、智力）有需要更新的改变时触发。
    MODIFIER_PROPERTY_UNIT_STATS_NEEDS_REFRESH = 170,

    /**
     * 方法名称：`GetModifierBountyCreepMultiplier`
     * 此方法返回怪物赏金的倍数增益。
     */
    MODIFIER_PROPERTY_BOUNTY_CREEP_MULTIPLIER = 171,

    /**
     * 方法名称：`GetModifierBountyOtherMultiplier`
     * 此方法返回其他赏金的倍数增益。
     */
    MODIFIER_PROPERTY_BOUNTY_OTHER_MULTIPLIER = 172,

    // `GetModifierUnitDisllowUpgrading`: 阻止单位进化或升级。
    MODIFIER_PROPERTY_UNIT_DISALLOW_UPGRADING = 173,

    // `GetModifierDodgeProjectile`: 单位具有躲避投射物的能力。
    MODIFIER_PROPERTY_DODGE_PROJECTILE = 174,

    // `GetTriggerCosmeticAndEndAttack`: 基于外观效果判定攻击结束。
    MODIFIER_PROPERTY_TRIGGER_COSMETIC_AND_END_ATTACK = 175,

    // `GetModifierMaxDebuffDuration`: 控制对单位施加的负面效果的最大持续时间。
    MODIFIER_PROPERTY_MAX_DEBUFF_DURATION = 176,

    // `GetPrimaryStatDamageMultiplier`: 改变基于单位主要属性所获得的额外伤害倍数。
    MODIFIER_PROPERTY_PRIMARY_STAT_DAMAGE_MULTIPLIER = 177,

    // `GetModifierPreAttack_DeadlyBlow`: 攻击有机会造成致命一击，可能是更高的伤害或即死效果。
    MODIFIER_PROPERTY_PREATTACK_DEADLY_BLOW = 178,

    // `GetAlwaysAutoAttackWhileHoldPosition`: 单位在原地不动状态下总是自动进行攻击。
    MODIFIER_PROPERTY_ALWAYS_AUTOATTACK_WHILE_HOLD_POSITION = 179,

    // `OnSpellTargetReady`: 当施法目标就绪时触发。
    MODIFIER_EVENT_ON_SPELL_TARGET_READY = 180,

    // `OnAbilityStart`: 当一个技能开始施法时触发。
    MODIFIER_EVENT_ON_ABILITY_START = 190,

    /**
     * 方法名称：`OnAbilityExecuted`
     * 在一个技能被执行时，此方法被调用。
     */
    MODIFIER_EVENT_ON_ABILITY_EXECUTED = 191,

    // `OnAbilityFullyCast`: 当一个技能完成施法时（有效释放）触发。
    MODIFIER_EVENT_ON_ABILITY_FULLY_CAST = 192,

    /**
     * 方法名称：`OnBreakInvisibility`
     * 在破解隐身时，此方法被调用。
     */
    MODIFIER_EVENT_ON_BREAK_INVISIBILITY = 193,

    /**
     * 方法名称：`OnAbilityEndChannel`
     * 在技能通道结束时，此方法被调用。
     */
    MODIFIER_EVENT_ON_ABILITY_END_CHANNEL = 194,

    /**
     * 方法名称：`OnProcessUpgrade`
     * 在处理升级时，此方法被调用。
     */
    MODIFIER_EVENT_ON_PROCESS_UPGRADE = 195,

    /**
     * 方法名称：`OnRefresh`
     * 在刷新时，此方法被调用。
     */
    MODIFIER_EVENT_ON_REFRESH = 196,

    /**
     * 方法名称：`OnTakeDamage`
     * 当承受伤害时，此方法被调用。
     */
    MODIFIER_EVENT_ON_TAKEDAMAGE = 197,

    /**
     * 方法名称：`OnDamagePrevented`
     * 当伤害被阻止时，此方法被调用。
     */
    MODIFIER_EVENT_ON_DEATH_PREVENTED = 198,

    /**
     * 方法名称：`OnStateChanged`
     * 当状态改变时，此方法被调用。
     */
    MODIFIER_EVENT_ON_STATE_CHANGED = 199,

    /**
     * 方法名称：`OnOrbEffect`
     * 在执行Orb Effect时，此方法被调用。
     */
    MODIFIER_EVENT_ON_ORB_EFFECT = 200,

    /**
     * 方法名称：`OnProcessCleave`
     * 在处理Cleave时，此方法被调用。
     */
    MODIFIER_EVENT_ON_PROCESS_CLEAVE = 201,

    /**
     * 方法名称：`OnDamageCalculated`
     * 当伤害计算后，此方法被调用。
     */
    MODIFIER_EVENT_ON_DAMAGE_CALCULATED = 202,

    /**
     * 方法名称：`OnMagicDamageCalculated`
     * 当魔法伤害计算后，此方法被调用。
     */
    MODIFIER_EVENT_ON_MAGIC_DAMAGE_CALCULATED = 203,

    /**
     * 方法名称：`OnAttacked`
     * 当被攻击时，此方法被调用。
     */
    MODIFIER_EVENT_ON_ATTACKED = 204,

    /**
     * 方法名称：`OnDeath`
     * 当角色死亡时，此方法被调用。
     */
    MODIFIER_EVENT_ON_DEATH = 205,

    /**
     * 方法名称：`OnDeathCompleted`
     * 当角色死亡完成时，此方法被调用。
     */
    MODIFIER_EVENT_ON_DEATH_COMPLETED = 206,

    /**
     * 方法名称：`OnRespawn`
     * 当角色重生时，此方法被调用。
     */
    MODIFIER_EVENT_ON_RESPAWN = 207,

    /**
     * 方法名称：`OnSpentMana`
     * 当花费法力值时，此方法被调用。
     */
    MODIFIER_EVENT_ON_SPENT_MANA = 208,

    /**
     * 方法名称：`OnSpentHealth`
     * 当花费生命值时，此方法被调用。
     */
    MODIFIER_EVENT_ON_SPENT_HEALTH = 209,

    /**
     * 方法名称：`OnTeleporting`
     * 在传送前时，此方法被调用。
     */
    MODIFIER_EVENT_ON_TELEPORTING = 210,

    /**
     * 方法名称：`OnTeleported`
     * 在传送后时，此方法被调用。
     */
    MODIFIER_EVENT_ON_TELEPORTED = 211,

    // `OnSetLocation`: 当单位位置被强制改变时触发。
    MODIFIER_EVENT_ON_SET_LOCATION = 212,

    // `OnHealthGained`: 当单位获得生命值时触发。
    MODIFIER_EVENT_ON_HEALTH_GAINED = 213,

    // `OnManaGained`: 当单位获得法力值时触发。
    MODIFIER_EVENT_ON_MANA_GAINED = 214,

    /**
     * 方法名称：`OnTakeDamageKillCredit`
     * 当取得因伤害导致的击杀积分时，此方法被调用。
     */
    MODIFIER_EVENT_ON_TAKEDAMAGE_KILLCREDIT = 215,

    /**
     * 方法名称：`OnHeroKilled`
     * 当英雄被击杀时，此方法被调用。
     */
    MODIFIER_EVENT_ON_HERO_KILLED = 216,

    /**
     * 方法名称：`OnHealReceived`
     * 当接收到治疗时，此方法被调用。
     */
    MODIFIER_EVENT_ON_HEAL_RECEIVED = 217,

    /**
     * 方法名称：`OnBuildingKilled`
     * 当建筑被摧毁时，此方法被调用。
     */
    MODIFIER_EVENT_ON_BUILDING_KILLED = 218,

    /**
     * 方法名称：`OnModelChanged`
     * 当模型发生改变时，此方法被调用。
     */
    MODIFIER_EVENT_ON_MODEL_CHANGED = 219,

    /**
     * 方法名称：`OnModifierAdded`
     * 当有新的修改器被添加时，此方法被调用。
     */
    MODIFIER_EVENT_ON_MODIFIER_ADDED = 220,


    // `OnTooltip`: 提供在游戏中鼠标悬浮时显示的工具提示文本的值。
    MODIFIER_PROPERTY_TOOLTIP = 221,

    // `GetModifierModelChange`: 更改或替换单位的模型。
    MODIFIER_PROPERTY_MODEL_CHANGE = 222,

    // `GetModifierModelScale`: 调整单位模型的缩放比例。
    MODIFIER_PROPERTY_MODEL_SCALE = 223,

    // `GetModifierModelScaleAnimateTime`: 配置模型缩放动画的过渡时间。
    MODIFIER_PROPERTY_MODEL_SCALE_ANIMATE_TIME = 224,

    // `GetModifierModelScaleUseInOutEase`: 为模型缩放动画提供淡入淡出效果。
    MODIFIER_PROPERTY_MODEL_SCALE_USE_IN_OUT_EASE = 225,

    // `GetModifierModelScaleConstant`: 提供恒定的模型缩放比例，不受动画影响。
    MODIFIER_PROPERTY_MODEL_SCALE_CONSTANT = 226,

    // `GetModifierScepter`: 当这个属性激活时，单位被视为持有阿哈利姆神杖。
    MODIFIER_PROPERTY_IS_SCEPTER = 227,

    // `GetModifierShard`: 当这个属性激活时，单位被视为持有阿哈利姆裂片。
    MODIFIER_PROPERTY_IS_SHARD = 228,

    // `GetModifierRadarCooldownReduction`: 减少雷达技能的冷却时间。
    MODIFIER_PROPERTY_RADAR_COOLDOWN_REDUCTION = 229,

    // `GetActivityTranslationModifiers`: 更改单位活动时所使用的修饰符名。
    MODIFIER_PROPERTY_TRANSLATE_ACTIVITY_MODIFIERS = 230,

    // `GetAttackSound`: 改变单位攻击时的声音。
    MODIFIER_PROPERTY_TRANSLATE_ATTACK_SOUND = 231,

    // `GetUnitLifetimeFraction`: 获取单位的存活时间比例。
    MODIFIER_PROPERTY_LIFETIME_FRACTION = 232,

    // `GetModifierProvidesFOWVision`: 修饰符提供战争迷雾视野。
    MODIFIER_PROPERTY_PROVIDES_FOW_POSITION = 233,

    // `GetModifierSpellsRequireHP`: 技能消耗改为生命值而非法力值。
    MODIFIER_PROPERTY_SPELLS_REQUIRE_HP = 234,

    // `GetForceDrawOnMinimap`: 在小地图上强制显示单位。
    MODIFIER_PROPERTY_FORCE_DRAW_MINIMAP = 235,

    // `GetModifierDisableTurning`: 禁用单位的转身动作。
    MODIFIER_PROPERTY_DISABLE_TURNING = 236,

    // `GetModifierIgnoreCastAngle`: 允许技能忽略施法角度的限制。
    MODIFIER_PROPERTY_IGNORE_CAST_ANGLE = 237,

    // `GetModifierChangeAbilityValue`: 更改特定能力的某些数值。
    MODIFIER_PROPERTY_CHANGE_ABILITY_VALUE = 238,

    // `GetModifierOverrideAbilitySpecial`: 覆盖技能的特殊值。
    MODIFIER_PROPERTY_OVERRIDE_ABILITY_SPECIAL = 239,

    // `GetModifierOverrideAbilitySpecialValue`: 提供技能覆盖的特殊值。
    MODIFIER_PROPERTY_OVERRIDE_ABILITY_SPECIAL_VALUE = 240,

    // `GetModifierAbilityLayout`: 改变英雄的技能布局。
    MODIFIER_PROPERTY_ABILITY_LAYOUT = 241,

    // `OnDominated`: 当单位被支配或控制时触发。
    MODIFIER_EVENT_ON_DOMINATED = 242,

    // `OnKill`: 当单位杀死另一个单位时触发。
    MODIFIER_EVENT_ON_KILL = 243,

    // `OnAssist`: 当单位协助杀死敌方单位时触发。
    MODIFIER_EVENT_ON_ASSIST = 244,

    // `GetModifierTempestDouble`: 允许单位复制技能或物品的加强效果到其分身上。
    MODIFIER_PROPERTY_TEMPEST_DOUBLE = 245,

    // `PreserveParticlesOnModelChanged`: 模型更改时保留特效粒子。
    MODIFIER_PROPERTY_PRESERVE_PARTICLES_ON_MODEL_CHANGE = 246,

    // `OnAttackFinished`: 当单位的攻击动作完成后触发。
    MODIFIER_EVENT_ON_ATTACK_FINISHED = 247,

    // `GetModifierIgnoreCooldown`: 允许单位忽略技能冷却时间。
    MODIFIER_PROPERTY_IGNORE_COOLDOWN = 248,

    // `GetModifierCanAttackTrees`: 允许单位攻击树木。
    MODIFIER_PROPERTY_CAN_ATTACK_TREES = 249,

    // `GetVisualZDelta`: 调整单位视觉上的Z轴位置偏移。
    MODIFIER_PROPERTY_VISUAL_Z_DELTA = 250,
    // `GetVisualZSpeedBaseOverride`: 调整单位的Z轴速度基础值。
    MODIFIER_PROPERTY_VISUAL_Z_SPEED_BASE_OVERRIDE = 251,

    // `MODIFIER_PROPERTY_INCOMING_DAMAGE_ILLUSION`: 修改幻象承受的伤害值。
    MODIFIER_PROPERTY_INCOMING_DAMAGE_ILLUSION = 252,

    // `GetModifierNoVisionOfAttacker`: 被攻击时不为攻击者提供视野。
    MODIFIER_PROPERTY_DONT_GIVE_VISION_OF_ATTACKER = 253,

    // `OnTooltip2`: 提供第二个工具提示，可以用于显示额外的信息，如升级的效果。
    MODIFIER_PROPERTY_TOOLTIP2 = 254,

    // `OnAttackRecordDestroy`: 当攻击记录被销毁时触发。
    MODIFIER_EVENT_ON_ATTACK_RECORD_DESTROY = 255,

    // `OnProjectileObstructionHit`: 当投射物撞击到障碍物时触发。
    MODIFIER_EVENT_ON_PROJECTILE_OBSTRUCTION_HIT = 256,

    // `GetSuppressTeleport`: 阻止单位使用传送技能或物品。
    MODIFIER_PROPERTY_SUPPRESS_TELEPORT = 257,

    // `OnAttackCancelled`: 当单位的攻击被取消时触发。
    MODIFIER_EVENT_ON_ATTACK_CANCELLED = 258,

    // `GetSuppressCleave`: 抑制单位的劈击效果。
    MODIFIER_PROPERTY_SUPPRESS_CLEAVE = 259,

    // `BotAttackScoreBonus`: 为AI（人工智能）提供攻击评分奖励。
    MODIFIER_PROPERTY_BOT_ATTACK_SCORE_BONUS = 260,

    // `GetModifierAttackSpeedReductionPercentage`: 攻击速度降低的百分比。
    MODIFIER_PROPERTY_ATTACKSPEED_REDUCTION_PERCENTAGE = 261,

    // `GetModifierMoveSpeedReductionPercentage`: 移速减少的百分比。
    MODIFIER_PROPERTY_MOVESPEED_REDUCTION_PERCENTAGE = 262,

    // `MODIFIER_PROPERTY_ATTACK_WHILE_MOVING_TARGET`: 允许单位在移动时攻击特定目标。
    MODIFIER_PROPERTY_ATTACK_WHILE_MOVING_TARGET = 263,

    // `GetModifierAttackSpeedPercentage`: 提供攻击速度的百分比增益。
    MODIFIER_PROPERTY_ATTACKSPEED_PERCENTAGE = 264,

    // `OnAttemptProjectileDodge`: 尝试躲避投射物时触发。
    MODIFIER_EVENT_ON_ATTEMPT_PROJECTILE_DODGE = 265,

    // `OnPreDebuffApplied`: 在负面效果应用之前触发。
    MODIFIER_EVENT_ON_PREDEBUFF_APPLIED = 266,

    // `GetModifierPercentageCooldownStacking`: 提供技能冷却时间的百分比叠加。
    MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE_STACKING = 267,

    // `GetModifierSpellRedirectTarget`: 使技能效果重定向到其他目标。
    MODIFIER_PROPERTY_SPELL_REDIRECT_TARGET = 268,

    // `GetModifierTurnRateConstant`: 为单位提供固定的转身速率。
    MODIFIER_PROPERTY_TURN_RATE_CONSTANT = 269,

    // `GetModifierIsRatPack`: 识别单位是否是鼠群成员，用于某些特殊效果的叠加。
    MODIFIER_PROPERTY_RAT_PACK = 270,

    // `GetModifierPhysicalDamageOutgoing_Percentage`: 物理伤害输出的百分比修改。
    MODIFIER_PROPERTY_PHYSICALDAMAGEOUTGOING_PERCENTAGE = 271,

    // `GetModifierKnockbackAmplification_Percentage`: 增加单位被击退效果的百分比。
    MODIFIER_PROPERTY_KNOCKBACK_AMPLIFICATION_PERCENTAGE = 272,

    // `GetModifierHealthBarPips`: 控制单位生命条上标记的数量，用于表示额外的信息，比如可叠加的层数。
    MODIFIER_PROPERTY_HEALTHBAR_PIPS = 273,

    // `GetModifierIncomingDamageConstant`: 修改单位受到的固定数值伤害。
    MODIFIER_PROPERTY_INCOMING_DAMAGE_CONSTANT = 274,

    // `OnSpellAppliedSuccessfully`: 当技能成功施放并命中目标后触发。
    MODIFIER_EVENT_SPELL_APPLIED_SUCCESSFULLY = 275,

    // `GetModifierAvoidDamageAfterReductions`: 允许单位在伤害减免计算后，有一定机会避免受到所有伤害。
    MODIFIER_PROPERTY_AVOID_DAMAGE_AFTER_REDUCTIONS = 276,

    // `GetModifierFailAttack`: 提供攻击可能失败（即攻击不会造成伤害或其他效果）的机制。
    MODIFIER_PROPERTY_FAIL_ATTACK = 277,

    // `GetModifierPrereduceIncomingDamage_Mult`: 使用乘法运算来进一步减少单位接收的传入伤害。
    MODIFIER_PROPERTY_PREREDUCE_INCOMING_DAMAGE_MULT = 278,

    // `GetModifierSuppressFullscreenDeathFX`: 当单位死亡时，阻止全屏死亡特效的播放。
    MODIFIER_PROPERTY_SUPPRESS_FULLSCREEN_DEATH_FX = 279,

    // `MODIFIER_PROPERTY_INCOMING_DAMAGE_CONSTANT_POST`: 修改单位在所有其他减伤计算完成后受到的伤害的固定数值。
    MODIFIER_PROPERTY_INCOMING_DAMAGE_CONSTANT_POST = 280,
    // `GetModifierDamageOutgoing_PercentageMultiplicative`: 修改单位输出伤害的乘法百分比。
    MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_MULTIPLICATIVE = 281,

    // `GetModifierTickGold_Multiplier`: 改变单位每次金钱滴答的乘法因子。
    MODIFIER_PROPERTY_TICK_GOLD_MULTIPLIER = 282,

    // `GetModifierSlowResistance`: 提供单位格挡减速效果的能力。
    MODIFIER_PROPERTY_SLOW_RESISTANCE = 283,

    // `GetModifierAoEBonusPercentage`: 改变单位的范围效果（AoE）伤害增益百分比。
    MODIFIER_PROPERTY_AOE_BONUS_PERCENTAGE = 284,

    // `GetModifierProjectileSpeed`: 修改单位投掷物的速度。
    MODIFIER_PROPERTY_PROJECTILE_SPEED = 285,

    // `GetModifierBecomeUniversal`: 允许特定单位的技能或者效果成为通用的，可能在多种单位间共享。
    MODIFIER_PROPERTY_BECOME_UNIVERSAL = 286,

    // `OnForceProcMagicStick`: 强制触发魔棒（Magic Stick）或者类似物品的效果。
    MODIFIER_EVENT_ON_FORCE_PROC_MAGIC_STICK = 287,

    // `GetModifierDoNotSinkAfterDeath`: 单位死亡后不下沉（游戏中一些单位死亡后会有下沉消失的动画）。
    MODIFIER_PROPERTY_DO_NOT_SINK_AFTER_DEATH = 288,

    // `OnDamageHPLoss`: 当单位承受伤害导致生命值降低时触发。
    MODIFIER_EVENT_ON_DAMAGE_HPLOSS = 289,

    // `GetModifierForceMaxHealth`: 设置单位的最大生命值。
    MODIFIER_PROPERTY_FORCE_MAX_HEALTH = 290,

    // `GetModifierAoEBonusConstant`: 提供范围效果伤害的恒定增益值。
    MODIFIER_PROPERTY_AOE_BONUS_CONSTANT = 291,

    // `MODIFIER_FUNCTION_LAST`: 修饰符函数的最大索引值，用于内部使用。
    MODIFIER_FUNCTION_LAST = 292,

    // `MODIFIER_FUNCTION_INVALID`: 无效修饰符的标记值。
    MODIFIER_FUNCTION_INVALID = 65535,
}