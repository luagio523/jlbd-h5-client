
// enum modifierfunction {
//     /**
//      * 定义前攻击额外伤害的属性
//      * 在普通攻击伤害计算前，增加额外的伤害值
//      */
//     MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE = 0,

//     /**
//      * 定义面向特定目标的前攻击额外伤害属性
//      * 对特定的单位施加额外的前攻击伤害值
//      */
//     MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET = 1,

//     /**
//      * 定义触发了的前攻击额外伤害的属性
//      * 可以与一些技能效果联动，如每次攻击都有机会触发额外伤害
//      */
//     MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PROC = 2,

//     /**
//      * 定义普通攻击暴击之后的额外伤害属性
//      * 暴击后，对目标造成额外的伤害
//      */
//     MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT = 3,

//     /**
//      * 定义基础攻击额外伤害的属性
//      * 增加攻击者的基础伤害值
//      */
//     MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE = 4,

//     /**
//      * 定义施加的物理伤害触发额外效果的属性
//      * 攻击触发时可能附加一些附加的物理伤害
//      */
//     MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL = 5,

//     /**
//      * 将攻击的物理伤害转换为魔法伤害的属性
//      */
//     MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL = 6,

//     /**
//      * 定义施加的魔法伤害触发额外效果的属性
//      * 攻击触发时可能附加一些附加的魔法伤害
//      */
//     MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL = 7,

//     /**
//      * 定义纯粹伤害触发额外效果的属性
//      * 攻击触发时可能附加一些附加的纯粹伤害
//      */
//     MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE = 8,

//     /**
//      * 定义针对目标的魔法伤害触发额外效果的属性
//      */
//     MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL_TARGET = 9,

//     /**
//      * 定义攻击触发反馈效果的属性
//      * 比如，对攻击你的单位附加一个负面效果
//      */
//     MODIFIER_PROPERTY_PROCATTACK_FEEDBACK = 10,

//     /**
//      * 允许覆盖单位的攻击伤害的属性
//      * 设定一个固定值作为单位的攻击伤害，取代默认计算逻辑
//      */
//     MODIFIER_PROPERTY_OVERRIDE_ATTACK_DAMAGE = 11,

//     /**
//      * 定义前攻击属性
//      * 这可能影响单位的前攻击行为或机制
//      */
//     MODIFIER_PROPERTY_PRE_ATTACK = 12,

//     /**
//      * 定义隐身级别的属性
//      * 设定隐身状态下的可见度，高级别隐身可能更难被侦测
//      */
//     MODIFIER_PROPERTY_INVISIBILITY_LEVEL = 13,

//     /**
//      * 定义隐身攻击行为例外的属性
//      * 某些情况下允许攻击不会打断隐身状态
//      */
//     MODIFIER_PROPERTY_INVISIBILITY_ATTACK_BEHAVIOR_EXCEPTION = 14,

//     /**
//      * 定义持续隐身状态的属性
//      * 即使执行某些行为也不会打断隐身
//      */
//     MODIFIER_PROPERTY_PERSISTENT_INVISIBILITY = 15,

//     // 一下修改器继续向下定义，以此类推...
// };



enum modifierfunction {
    /**
     * Method Name: `GetModifierPreAttack_BonusDamage`
     */ MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE = 0,
    /**
     * Method Name: `GetModifierPreAttack_BonusDamage_Target`
     */
    MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET = 1,
    /**
     * Method Name: `GetModifierPreAttack_BonusDamage_Proc`
     */
    MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PROC = 2,
    /**
     * Method Name: `GetModifierPreAttack_BonusDamagePostCrit`
     */
    MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT = 3,
    /**
     * Method Name: `GetModifierBaseAttack_BonusDamage`
     */
    MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE = 4,
    /**
     * Method Name: `GetModifierProcAttack_BonusDamage_Physical`
     */
    MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL = 5,
    /**
     * Method Name: `GetModifierProcAttack_ConvertPhysicalToMagical`
     */
    MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL = 6,
    /**
     * Method Name: `GetModifierProcAttack_BonusDamage_Magical`
     */
    MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL = 7,
    /**
     * Method Name: `GetModifierProcAttack_BonusDamage_Pure`
     */
    MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE = 8,
    /**
     * Method Name: `GetModifierProcAttack_BonusDamage_Magical_Target`
     */
    MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL_TARGET = 9,
    /**
     * Method Name: `GetModifierProcAttack_Feedback`
     */
    MODIFIER_PROPERTY_PROCATTACK_FEEDBACK = 10,
    /**
     * Method Name: `GetModifierOverrideAttackDamage`
     */
    MODIFIER_PROPERTY_OVERRIDE_ATTACK_DAMAGE = 11,
    /**
     * Method Name: `GetModifierPreAttack`
     */
    MODIFIER_PROPERTY_PRE_ATTACK = 12,
    /**
     * Method Name: `GetModifierInvisibilityLevel`
     */
    MODIFIER_PROPERTY_INVISIBILITY_LEVEL = 13,
    /**
     * Method Name: `GetModifierInvisibilityAttackBehaviorException`
     */
    MODIFIER_PROPERTY_INVISIBILITY_ATTACK_BEHAVIOR_EXCEPTION = 14,
    /**
     * Method Name: `GetModifierPersistentInvisibility`
     */
    MODIFIER_PROPERTY_PERSISTENT_INVISIBILITY = 15,
    /**
     * Method Name: `GetModifierMoveSpeedBonus_Constant`
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT = 16,
    /**
     * Method Name: `GetModifierMoveSpeedOverride`
     */
    MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE = 17,
    /**
     * Method Name: `GetModifierMoveSpeedBonus_Percentage`
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE = 18,
    /**
     * Method Name: `GetModifierMoveSpeedBonus_Percentage_Unique`
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE = 19,
    /**
     * Method Name: `GetModifierMoveSpeedBonus_Special_Boots`
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE = 20,
    /**
     * Method Name: `GetModifierMoveSpeedBonus_Special_Boots_2`
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE_2 = 21,
    /**
     * Method Name: `GetModifierMoveSpeedBonus_Constant_Unique`
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE = 22,
    /**
     * Method Name: `GetModifierMoveSpeedBonus_Constant_Unique_2`
     */
    MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE_2 = 23,
    /**
     * Method Name: `GetModifierMoveSpeed_Absolute`
     */
    MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE = 24,
    /**
     * Method Name: `GetModifierMoveSpeed_AbsoluteMin`
     */
    MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN = 25,
    /**
     * Method Name: `GetModifierMoveSpeed_AbsoluteMax`
     */
    MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MAX = 26,
    /**
     * Method Name: `GetModifierIgnoreMovespeedLimit`
     */
    MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT = 27,
    /**
     * Method Name: `GetModifierMoveSpeed_Limit`
     */
    MODIFIER_PROPERTY_MOVESPEED_LIMIT = 28,
    /**
     * Method Name: `GetModifierAttackSpeedBaseOverride`
     */
    MODIFIER_PROPERTY_ATTACKSPEED_BASE_OVERRIDE = 29,
    /**
     * Method Name: `GetModifierFixedAttackRate`
     */
    MODIFIER_PROPERTY_FIXED_ATTACK_RATE = 30,
    /**
     * Method Name: `GetModifierAttackSpeedBonus_Constant`
     */
    MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT = 31,
    /**
     * Method Name: `GetModifierAttackSpeed_Limit`
     */
    MODIFIER_PROPERTY_IGNORE_ATTACKSPEED_LIMIT = 32,
    /**
     * Method Name: `GetModifierCooldownReduction_Constant`
     */
    MODIFIER_PROPERTY_COOLDOWN_REDUCTION_CONSTANT = 33,
    /**
     * Method Name: `GetModifierManacostReduction_Constant`
     */
    MODIFIER_PROPERTY_MANACOST_REDUCTION_CONSTANT = 34,
    /**
     * Method Name: `GetModifierHealthcostReduction_Constant`
     */
    MODIFIER_PROPERTY_HEALTHCOST_REDUCTION_CONSTANT = 35,
    /**
     * Method Name: `GetModifierBaseAttackTimeConstant`
     */
    MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT = 36,
    /**
     * Method Name: `GetModifierBaseAttackTimeConstant_Adjust`
     */
    MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT_ADJUST = 37,
    /**
     * Method Name: `GetModifierBaseAttackTimePercentage`
     */
    MODIFIER_PROPERTY_BASE_ATTACK_TIME_PERCENTAGE = 38,
    /**
     * Method Name: `GetModifierAttackPointConstant`
     */
    MODIFIER_PROPERTY_ATTACK_POINT_CONSTANT = 39,
    /**
     * Method Name: `GetModifierBonusDamageOutgoing_Percentage`
     */
    MODIFIER_PROPERTY_BONUSDAMAGEOUTGOING_PERCENTAGE = 40,
    /**
     * Method Name: `GetModifierDamageOutgoing_Percentage`
     */
    MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE = 41,
    /**
     * Method Name: `GetModifierDamageOutgoing_Percentage_Illusion`
     */
    MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION = 42,
    /**
     * Method Name: `GetModifierDamageOutgoing_Percentage_Illusion_Amplify`
     */
    MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION_AMPLIFY = 43,
    /**
     * Method Name: `GetModifierTotalDamageOutgoing_Percentage`
     */
    MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE = 44,
    /**
     * Method Name: `GetModifierSpellAmplify_PercentageCreep`
     */
    MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_CREEP = 45,
    /**
     * Method Name: `GetModifierSpellAmplify_Percentage`
     */
    MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE = 46,
    /**
     * Method Name: `GetModifierSpellAmplify_PercentageUnique`
     */
    MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_UNIQUE = 47,
    /**
     * Method Name: `GetModifierHealAmplify_PercentageSource`
     */
    MODIFIER_PROPERTY_HEAL_AMPLIFY_PERCENTAGE_SOURCE = 48,
    /**
     * Method Name: `GetModifierHealAmplify_PercentageTarget`
     */
    MODIFIER_PROPERTY_HEAL_AMPLIFY_PERCENTAGE_TARGET = 49,
    /**
     * Method Name: `GetModifierHPRegen_CanBeNegative`
     */
    MODIFIER_PROPERTY_HP_REGEN_CAN_BE_NEGATIVE = 50,
    /**
     * Method Name: `GetModifierHPRegenAmplify_Percentage`
     */
    MODIFIER_PROPERTY_HP_REGEN_AMPLIFY_PERCENTAGE = 51,
    /**
     * Method Name: `GetModifierLifestealRegenAmplify_Percentage`
     */
    MODIFIER_PROPERTY_LIFESTEAL_AMPLIFY_PERCENTAGE = 52,
    /**
     * Method Name: `GetModifierSpellLifestealRegenAmplify_Percentage`
     */
    MODIFIER_PROPERTY_SPELL_LIFESTEAL_AMPLIFY_PERCENTAGE = 53,
    /**
     * Method Name: `GetModifierMPRegenAmplify_Percentage`
     */
    MODIFIER_PROPERTY_MP_REGEN_AMPLIFY_PERCENTAGE = 54,
    /**
     * Method Name: `GetModifierManaDrainAmplify_Percentage`
     */
    MODIFIER_PROPERTY_MANA_DRAIN_AMPLIFY_PERCENTAGE = 55,
    /**
     * Total amplify value is clamped to 0.
     *
     *
     *
     * Method Name: `GetModifierMPRestoreAmplify_Percentage`.
     */
    MODIFIER_PROPERTY_MP_RESTORE_AMPLIFY_PERCENTAGE = 56,
    /**
     * Method Name: `GetModifierBaseDamageOutgoing_Percentage`
     */
    MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE = 57,
    /**
     * Method Name: `GetModifierBaseDamageOutgoing_PercentageUnique`
     */
    MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE_UNIQUE = 58,
    /**
     * Method Name: `GetModifierIncomingDamage_Percentage`
     */
    MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE = 59,
    /**
     * Method Name: `GetModifierIncomingPhysicalDamage_Percentage`
     */
    MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE = 60,
    /**
     * This property controls 'physical' shield, if defined both on client and server.
     * Return value on client should be current shield health, as a positive integer,
     * on server - amount of damage blocked.
     *
     *
     *
     * Method Name: `GetModifierIncomingPhysicalDamageConstant`.
     */
    MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_CONSTANT = 61,
    /**
     * This property controls 'spell' shield, if defined both on client and server.
     * Return value on client should be current shield health, as a positive integer,
     * on server - amount of damage blocked.
     *
     *
     *
     * Method Name: `GetModifierIncomingSpellDamageConstant`.
     */
    MODIFIER_PROPERTY_INCOMING_SPELL_DAMAGE_CONSTANT = 62,
    /**
     * Method Name: `GetModifierEvasion_Constant`
     */
    MODIFIER_PROPERTY_EVASION_CONSTANT = 63,
    /**
     * Method Name: `GetModifierNegativeEvasion_Constant`
     */
    MODIFIER_PROPERTY_NEGATIVE_EVASION_CONSTANT = 64,
    /**
     * Method Name: `GetModifierStatusResistance`
     */
    MODIFIER_PROPERTY_STATUS_RESISTANCE = 65,
    /**
     * Method Name: `GetModifierStatusResistanceStacking`
     */
    MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING = 66,
    /**
     * Method Name: `GetModifierStatusResistanceCaster`
     */
    MODIFIER_PROPERTY_STATUS_RESISTANCE_CASTER = 67,
    /**
     * Method Name: `GetModifierAvoidDamage`
     */
    MODIFIER_PROPERTY_AVOID_DAMAGE = 68,
    /**
     * Method Name: `GetModifierAvoidSpell`
     */
    MODIFIER_PROPERTY_AVOID_SPELL = 69,
    /**
     * Method Name: `GetModifierMiss_Percentage`
     */
    MODIFIER_PROPERTY_MISS_PERCENTAGE = 70,
    /**
     * Values above 100% are ignored.
     *
     *
     *
     * Method Name: `GetModifierPhysicalArmorBase_Percentage`.
     */
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE = 71,
    /**
     * Method Name: `GetModifierPhysicalArmorTotal_Percentage`
     */
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE = 72,
    /**
     * Method Name: `GetModifierPhysicalArmorBonus`
     */
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS = 73,
    /**
     * Method Name: `GetModifierPhysicalArmorBonusUnique`
     */
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE = 74,
    /**
     * Method Name: `GetModifierPhysicalArmorBonusUniqueActive`
     */
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE = 75,
    /**
     * Method Name: `GetModifierPhysicalArmorBonusPost`
     */
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_POST = 76,
    /**
     * Method Name: `GetModifierMinPhysicalArmor`
     */
    MODIFIER_PROPERTY_MIN_PHYSICAL_ARMOR = 77,
    /**
     * Method Name: `GetModifierIgnorePhysicalArmor`
     */
    MODIFIER_PROPERTY_IGNORE_PHYSICAL_ARMOR = 78,
    /**
     * Method Name: `GetModifierMagicalResistanceBaseReduction`
     */
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BASE_REDUCTION = 79,
    /**
     * Method Name: `GetModifierMagicalResistanceDirectModification`
     */
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DIRECT_MODIFICATION = 80,
    /**
     * Method Name: `GetModifierMagicalResistanceBonus`
     */
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS = 81,
    /**
     * Method Name: `GetModifierMagicalResistanceBonusIllusions`
     */
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS_ILLUSIONS = 82,
    /**
     * Method Name: `GetModifierMagicalResistanceBonusUnique`
     */
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS_UNIQUE = 83,
    /**
     * Method Name: `GetModifierMagicalResistanceDecrepifyUnique`
     */
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE = 84,
    /**
     * Method Name: `GetModifierBaseRegen`
     */
    MODIFIER_PROPERTY_BASE_MANA_REGEN = 85,
    /**
     * Method Name: `GetModifierConstantManaRegen`
     */
    MODIFIER_PROPERTY_MANA_REGEN_CONSTANT = 86,
    /**
     * Method Name: `GetModifierConstantManaRegenUnique`
     */
    MODIFIER_PROPERTY_MANA_REGEN_CONSTANT_UNIQUE = 87,
    /**
     * Method Name: `GetModifierTotalPercentageManaRegen`
     */
    MODIFIER_PROPERTY_MANA_REGEN_TOTAL_PERCENTAGE = 88,
    /**
     * Method Name: `GetModifierConstantHealthRegen`
     */
    MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT = 89,
    /**
     * Method Name: `GetModifierHealthRegenPercentage`
     */
    MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE = 90,
    /**
     * Method Name: `GetModifierHealthRegenPercentageUnique`
     */
    MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE_UNIQUE = 91,
    /**
     * Method Name: `GetModifierHealthBonus`
     */
    MODIFIER_PROPERTY_HEALTH_BONUS = 92,
    /**
     * Method Name: `GetModifierManaBonus`
     */
    MODIFIER_PROPERTY_MANA_BONUS = 93,
    /**
     * Method Name: `GetModifierExtraStrengthBonus`
     */
    MODIFIER_PROPERTY_EXTRA_STRENGTH_BONUS = 94,
    /**
     * Method Name: `GetModifierExtraHealthBonus`
     */
    MODIFIER_PROPERTY_EXTRA_HEALTH_BONUS = 95,
    /**
     * Method Name: `GetModifierExtraManaBonus`
     */
    MODIFIER_PROPERTY_EXTRA_MANA_BONUS = 96,
    /**
     * Method Name: `GetModifierExtraManaBonusPercentage`
     */
    MODIFIER_PROPERTY_EXTRA_MANA_BONUS_PERCENTAGE = 97,
    /**
     * Method Name: `GetModifierExtraHealthPercentage`
     */
    MODIFIER_PROPERTY_EXTRA_HEALTH_PERCENTAGE = 98,
    /**
     * Method Name: `GetModifierExtraManaPercentage`
     */
    MODIFIER_PROPERTY_EXTRA_MANA_PERCENTAGE = 99,
    /**
     * Method Name: `GetModifierBonusStats_Strength`
     */
    MODIFIER_PROPERTY_STATS_STRENGTH_BONUS = 100,
    /**
     * Method Name: `GetModifierBonusStats_Agility`
     */
    MODIFIER_PROPERTY_STATS_AGILITY_BONUS = 101,
    /**
     * Method Name: `GetModifierBonusStats_Intellect`
     */
    MODIFIER_PROPERTY_STATS_INTELLECT_BONUS = 102,
    /**
     * Method Name: `GetModifierBonusStats_Strength_Percentage`
     */
    MODIFIER_PROPERTY_STATS_STRENGTH_BONUS_PERCENTAGE = 103,
    /**
     * Method Name: `GetModifierBonusStats_Agility_Percentage`
     */
    MODIFIER_PROPERTY_STATS_AGILITY_BONUS_PERCENTAGE = 104,
    /**
     * Method Name: `GetModifierBonusStats_Intellect_Percentage`
     */
    MODIFIER_PROPERTY_STATS_INTELLECT_BONUS_PERCENTAGE = 105,
    /**
     * Method Name: `GetModifierCastRangeBonus`
     */
    MODIFIER_PROPERTY_CAST_RANGE_BONUS = 106,
    /**
     * Method Name: `GetModifierCastRangeBonusPercentage`
     */
    MODIFIER_PROPERTY_CAST_RANGE_BONUS_PERCENTAGE = 107,
    /**
     * Method Name: `GetModifierCastRangeBonusTarget`
     */
    MODIFIER_PROPERTY_CAST_RANGE_BONUS_TARGET = 108,
    /**
     * Method Name: `GetModifierCastRangeBonusStacking`
     */
    MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING = 109,
    /**
     * Method Name: `GetModifierAttackRangeOverride`
     */
    MODIFIER_PROPERTY_ATTACK_RANGE_BASE_OVERRIDE = 110,
    /**
     * Method Name: `GetModifierAttackRangeBonus`
     */
    MODIFIER_PROPERTY_ATTACK_RANGE_BONUS = 111,
    /**
     * Method Name: `GetModifierAttackRangeBonusUnique`
     */
    MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_UNIQUE = 112,
    /**
     * Method Name: `GetModifierAttackRangeBonusPercentage`
     */
    MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_PERCENTAGE = 113,
    /**
     * Method Name: `GetModifierMaxAttackRange`
     */
    MODIFIER_PROPERTY_MAX_ATTACK_RANGE = 114,
    /**
     * Method Name: `GetModifierProjectileSpeedBonus`
     */
    MODIFIER_PROPERTY_PROJECTILE_SPEED_BONUS = 115,
    /**
     * Method Name: `GetModifierProjectileSpeedBonusPercentage`
     */
    MODIFIER_PROPERTY_PROJECTILE_SPEED_BONUS_PERCENTAGE = 116,
    /**
     * Method Name: `GetModifierProjectileName`
     */
    MODIFIER_PROPERTY_PROJECTILE_NAME = 117,
    /**
     * Method Name: `ReincarnateTime`
     */
    MODIFIER_PROPERTY_REINCARNATION = 118,
    /**
     * Method Name: `ReincarnateSuppressFX`
     */
    MODIFIER_PROPERTY_REINCARNATION_SUPPRESS_FX = 119,
    /**
     * Method Name: `GetModifierConstantRespawnTime`
     */
    MODIFIER_PROPERTY_RESPAWNTIME = 120,
    /**
     * Method Name: `GetModifierPercentageRespawnTime`
     */
    MODIFIER_PROPERTY_RESPAWNTIME_PERCENTAGE = 121,
    /**
     * Method Name: `GetModifierStackingRespawnTime`
     */
    MODIFIER_PROPERTY_RESPAWNTIME_STACKING = 122,
    /**
     * Method Name: `GetModifierPercentageCooldown`
     */
    MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE = 123,
    /**
     * Method Name: `GetModifierPercentageCooldownOngoing`
     */
    MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE_ONGOING = 124,
    /**
     * Method Name: `GetModifierPercentageCasttime`
     */
    MODIFIER_PROPERTY_CASTTIME_PERCENTAGE = 125,
    /**
     * Method Name: `GetModifierPercentageAttackAnimTime`
     */
    MODIFIER_PROPERTY_ATTACK_ANIM_TIME_PERCENTAGE = 126,
    /**
     * Method Name: `GetModifierPercentageManacost`
     */
    MODIFIER_PROPERTY_MANACOST_PERCENTAGE = 127,
    /**
     * Method Name: `GetModifierPercentageManacostStacking`
     */
    MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING = 128,
    /**
     * Method Name: `GetModifierPercentageHealthcost`
     */
    MODIFIER_PROPERTY_HEALTHCOST_PERCENTAGE = 129,
    /**
     * Method Name: `GetModifierPercentageHealthcostStacking`
     */
    MODIFIER_PROPERTY_HEALTHCOST_PERCENTAGE_STACKING = 130,
    /**
     * Method Name: `GetModifierConstantDeathGoldCost`
     */
    MODIFIER_PROPERTY_DEATHGOLDCOST = 131,
    /**
     * Method Name: `GetModifierPercentageExpRateBoost`
     */
    MODIFIER_PROPERTY_EXP_RATE_BOOST = 132,
    /**
     * Method Name: `GetModifierPercentageGoldRateBoost`
     */
    MODIFIER_PROPERTY_GOLD_RATE_BOOST = 133,
    /**
     * Method Name: `GetModifierPreAttack_CriticalStrike`
     */
    MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE = 134,
    /**
     * Method Name: `GetModifierPreAttack_Target_CriticalStrike`
     */
    MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE = 135,
    /**
     * Method Name: `GetModifierMagical_ConstantBlock`
     */
    MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK = 136,
    /**
     * Method Name: `GetModifierPhysical_ConstantBlock`
     */
    MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK = 137,
    /**
     * Method Name: `GetModifierPhysical_ConstantBlockSpecial`
     */
    MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK_SPECIAL = 138,
    /**
     * Method Name: `GetModifierPhysical_ConstantBlockUnavoidablePreArmor`
     */
    MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK_UNAVOIDABLE_PRE_ARMOR = 139,
    /**
     * Method Name: `GetModifierTotal_ConstantBlock`
     */
    MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK = 140,
    /**
     * Method Name: `GetOverrideAnimation`
     */
    MODIFIER_PROPERTY_OVERRIDE_ANIMATION = 141,
    /**
     * Method Name: `GetOverrideAnimationWeight`
     */
    MODIFIER_PROPERTY_OVERRIDE_ANIMATION_WEIGHT = 142,
    /**
     * Method Name: `GetOverrideAnimationRate`
     */
    MODIFIER_PROPERTY_OVERRIDE_ANIMATION_RATE = 143,
    /**
     * Method Name: `GetAbsorbSpell`
     */
    MODIFIER_PROPERTY_ABSORB_SPELL = 144,
    /**
     * Method Name: `GetReflectSpell`
     */
    MODIFIER_PROPERTY_REFLECT_SPELL = 145,
    /**
     * Method Name: `GetDisableAutoAttack`
     */
    MODIFIER_PROPERTY_DISABLE_AUTOATTACK = 146,
    /**
     * Method Name: `GetBonusDayVision`
     */
    MODIFIER_PROPERTY_BONUS_DAY_VISION = 147,
    /**
     * Method Name: `GetBonusDayVisionPercentage`
     */
    MODIFIER_PROPERTY_BONUS_DAY_VISION_PERCENTAGE = 148,
    /**
     * Method Name: `GetBonusNightVision`
     */
    MODIFIER_PROPERTY_BONUS_NIGHT_VISION = 149,
    /**
     * Method Name: `GetBonusNightVisionUnique`
     */
    MODIFIER_PROPERTY_BONUS_NIGHT_VISION_UNIQUE = 150,
    /**
     * Method Name: `GetBonusVisionPercentage`
     */
    MODIFIER_PROPERTY_BONUS_VISION_PERCENTAGE = 151,
    /**
     * Method Name: `GetFixedDayVision`
     */
    MODIFIER_PROPERTY_FIXED_DAY_VISION = 152,
    /**
     * Method Name: `GetFixedNightVision`
     */
    MODIFIER_PROPERTY_FIXED_NIGHT_VISION = 153,
    /**
     * Method Name: `GetMinHealth`
     */
    MODIFIER_PROPERTY_MIN_HEALTH = 154,
    /**
     * Method Name: `GetAbsoluteNoDamagePhysical`
     */
    MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL = 155,
    /**
     * Method Name: `GetAbsoluteNoDamageMagical`
     */
    MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_MAGICAL = 156,
    /**
     * Method Name: `GetAbsoluteNoDamagePure`
     */
    MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE = 157,
    /**
     * Method Name: `GetIsIllusion`
     */
    MODIFIER_PROPERTY_IS_ILLUSION = 158,
    /**
     * Method Name: `GetModifierIllusionLabel`
     */
    MODIFIER_PROPERTY_ILLUSION_LABEL = 159,
    /**
     * Method Name: `GetModifierStrongIllusion`
     */
    MODIFIER_PROPERTY_STRONG_ILLUSION = 160,
    /**
     * Method Name: `GetModifierSuperIllusion`
     */
    MODIFIER_PROPERTY_SUPER_ILLUSION = 161,
    /**
     * Method Name: `GetModifierSuperIllusionWithUltimate`
     */
    MODIFIER_PROPERTY_SUPER_ILLUSION_WITH_ULTIMATE = 162,
    /**
     * Method Name: `GetModifierXPDuringDeath`
     */
    MODIFIER_PROPERTY_XP_DURING_DEATH = 163,
    /**
     * Method Name: `GetModifierTurnRate_Percentage`
     */
    MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE = 164,
    /**
     * Method Name: `GetModifierTurnRate_Override`
     */
    MODIFIER_PROPERTY_TURN_RATE_OVERRIDE = 165,
    /**
     * Method Name: `GetDisableHealing`
     */
    MODIFIER_PROPERTY_DISABLE_HEALING = 166,
    /**
     * Method Name: `GetAlwaysAllowAttack`
     */
    MODIFIER_PROPERTY_ALWAYS_ALLOW_ATTACK = 167,
    /**
     * Method Name: `GetAllowEtherealAttack`
     */
    MODIFIER_PROPERTY_ALWAYS_ETHEREAL_ATTACK = 168,
    /**
     * Method Name: `GetOverrideAttackMagical`
     */
    MODIFIER_PROPERTY_OVERRIDE_ATTACK_MAGICAL = 169,
    /**
     * Method Name: `GetModifierUnitStatsNeedsRefresh`
     */
    MODIFIER_PROPERTY_UNIT_STATS_NEEDS_REFRESH = 170,
    MODIFIER_PROPERTY_BOUNTY_CREEP_MULTIPLIER = 171,
    MODIFIER_PROPERTY_BOUNTY_OTHER_MULTIPLIER = 172,
    /**
     * Method Name: `GetModifierUnitDisllowUpgrading`
     */
    MODIFIER_PROPERTY_UNIT_DISALLOW_UPGRADING = 173,
    /**
     * Method Name: `GetModifierDodgeProjectile`
     */
    MODIFIER_PROPERTY_DODGE_PROJECTILE = 174,
    /**
     * Method Name: `GetTriggerCosmeticAndEndAttack`
     */
    MODIFIER_PROPERTY_TRIGGER_COSMETIC_AND_END_ATTACK = 175,
    /**
     * Method Name: `GetModifierMaxDebuffDuration`
     */
    MODIFIER_PROPERTY_MAX_DEBUFF_DURATION = 176,
    /**
     * Method Name: `GetPrimaryStatDamageMultiplier`
     */
    MODIFIER_PROPERTY_PRIMARY_STAT_DAMAGE_MULTIPLIER = 177,
    /**
     * Method Name: `GetModifierPreAttack_DeadlyBlow`
     */
    MODIFIER_PROPERTY_PREATTACK_DEADLY_BLOW = 178,
    /**
     * Method Name: `GetAlwaysAutoAttackWhileHoldPosition`
     */
    MODIFIER_PROPERTY_ALWAYS_AUTOATTACK_WHILE_HOLD_POSITION = 179,
    /**
     * Method Name: `OnSpellTargetReady`
     */
    MODIFIER_EVENT_ON_SPELL_TARGET_READY = 180,
    /**
     * Method Name: `OnAttackRecord`
     */
    MODIFIER_EVENT_ON_ATTACK_RECORD = 181,
    /**
     * Method Name: `OnAttackStart`
     */
    MODIFIER_EVENT_ON_ATTACK_START = 182,
    /**
     * Method Name: `OnAttack`
     */
    MODIFIER_EVENT_ON_ATTACK = 183,
    /**
     * Method Name: `OnAttackLanded`
     */
    MODIFIER_EVENT_ON_ATTACK_LANDED = 184,
    /**
     * Method Name: `OnAttackFail`
     */
    MODIFIER_EVENT_ON_ATTACK_FAIL = 185,
    /**
     * Happens even if attack can't be issued.
     *
     *
     *
     * Method Name: `OnAttackAllied`.
     */
    MODIFIER_EVENT_ON_ATTACK_ALLIED = 186,
    /**
     * Method Name: `OnProjectileDodge`
     */
    MODIFIER_EVENT_ON_PROJECTILE_DODGE = 187,
    /**
     * Method Name: `OnOrder`
     */
    MODIFIER_EVENT_ON_ORDER = 188,
    /**
     * Method Name: `OnUnitMoved`
     */
    MODIFIER_EVENT_ON_UNIT_MOVED = 189,
    /**
     * Method Name: `OnAbilityStart`
     */
    MODIFIER_EVENT_ON_ABILITY_START = 190,
    /**
     * Method Name: `OnAbilityExecuted`
     */
    MODIFIER_EVENT_ON_ABILITY_EXECUTED = 191,
    /**
     * Method Name: `OnAbilityFullyCast`
     */
    MODIFIER_EVENT_ON_ABILITY_FULLY_CAST = 192,
    /**
     * Method Name: `OnBreakInvisibility`
     */
    MODIFIER_EVENT_ON_BREAK_INVISIBILITY = 193,
    /**
     * Method Name: `OnAbilityEndChannel`
     */
    MODIFIER_EVENT_ON_ABILITY_END_CHANNEL = 194,
    MODIFIER_EVENT_ON_PROCESS_UPGRADE = 195,
    MODIFIER_EVENT_ON_REFRESH = 196,
    /**
     * Method Name: `OnTakeDamage`
     */
    MODIFIER_EVENT_ON_TAKEDAMAGE = 197,
    /**
     * Method Name: `OnDamagePrevented`
     */
    MODIFIER_EVENT_ON_DEATH_PREVENTED = 198,
    /**
     * Method Name: `OnStateChanged`
     */
    MODIFIER_EVENT_ON_STATE_CHANGED = 199,
    MODIFIER_EVENT_ON_ORB_EFFECT = 200,
    /**
     * Method Name: `OnProcessCleave`
     */
    MODIFIER_EVENT_ON_PROCESS_CLEAVE = 201,
    /**
     * Method Name: `OnDamageCalculated`
     */
    MODIFIER_EVENT_ON_DAMAGE_CALCULATED = 202,
    /**
     * Method Name: `OnMagicDamageCalculated`
     */
    MODIFIER_EVENT_ON_MAGIC_DAMAGE_CALCULATED = 203,
    /**
     * Method Name: `OnAttacked`
     */
    MODIFIER_EVENT_ON_ATTACKED = 204,
    /**
     * Method Name: `OnDeath`
     */
    MODIFIER_EVENT_ON_DEATH = 205,
    /**
     * Method Name: `OnDeathCompleted`
     */
    MODIFIER_EVENT_ON_DEATH_COMPLETED = 206,
    /**
     * Method Name: `OnRespawn`
     */
    MODIFIER_EVENT_ON_RESPAWN = 207,
    /**
     * Method Name: `OnSpentMana`
     */
    MODIFIER_EVENT_ON_SPENT_MANA = 208,
    /**
     * Method Name: `OnSpentHealth`
     */
    MODIFIER_EVENT_ON_SPENT_HEALTH = 209,
    /**
     * Method Name: `OnTeleporting`
     */
    MODIFIER_EVENT_ON_TELEPORTING = 210,
    /**
     * Method Name: `OnTeleported`
     */
    MODIFIER_EVENT_ON_TELEPORTED = 211,
    /**
     * Method Name: `OnSetLocation`
     */
    MODIFIER_EVENT_ON_SET_LOCATION = 212,
    /**
     * Method Name: `OnHealthGained`
     */
    MODIFIER_EVENT_ON_HEALTH_GAINED = 213,
    /**
     * Method Name: `OnManaGained`
     */
    MODIFIER_EVENT_ON_MANA_GAINED = 214,
    /**
     * Method Name: `OnTakeDamageKillCredit`
     */
    MODIFIER_EVENT_ON_TAKEDAMAGE_KILLCREDIT = 215,
    /**
     * Method Name: `OnHeroKilled`
     */
    MODIFIER_EVENT_ON_HERO_KILLED = 216,
    /**
     * Method Name: `OnHealReceived`
     */
    MODIFIER_EVENT_ON_HEAL_RECEIVED = 217,
    /**
     * Method Name: `OnBuildingKilled`
     */
    MODIFIER_EVENT_ON_BUILDING_KILLED = 218,
    /**
     * Method Name: `OnModelChanged`
     */
    MODIFIER_EVENT_ON_MODEL_CHANGED = 219,
    /**
     * Method Name: `OnModifierAdded`
     */
    MODIFIER_EVENT_ON_MODIFIER_ADDED = 220,
    /**
     * Method Name: `OnTooltip`
     */
    MODIFIER_PROPERTY_TOOLTIP = 221,
    /**
     * Method Name: `GetModifierModelChange`
     */
    MODIFIER_PROPERTY_MODEL_CHANGE = 222,
    /**
     * Method Name: `GetModifierModelScale`
     */
    MODIFIER_PROPERTY_MODEL_SCALE = 223,
    /**
     * Method Name: `GetModifierModelScaleAnimateTime`
     */
    MODIFIER_PROPERTY_MODEL_SCALE_ANIMATE_TIME = 224,
    /**
     * Method Name: `GetModifierModelScaleUseInOutEase`
     */
    MODIFIER_PROPERTY_MODEL_SCALE_USE_IN_OUT_EASE = 225,
    /**
     * Method Name: `GetModifierModelScaleConstant`
     */
    MODIFIER_PROPERTY_MODEL_SCALE_CONSTANT = 226,
    /**
     * Applies scepter when this property is active
     *
     *
     *
     * Method Name: `GetModifierScepter`.
     */
    MODIFIER_PROPERTY_IS_SCEPTER = 227,
    /**
     * Applies shard when this property is active
     *
     *
     *
     * Method Name: `GetModifierShard`.
     */
    MODIFIER_PROPERTY_IS_SHARD = 228,
    /**
     * Method Name: `GetModifierRadarCooldownReduction`
     */
    MODIFIER_PROPERTY_RADAR_COOLDOWN_REDUCTION = 229,
    /**
     * Method Name: `GetActivityTranslationModifiers`
     */
    MODIFIER_PROPERTY_TRANSLATE_ACTIVITY_MODIFIERS = 230,
    /**
     * Method Name: `GetAttackSound`
     */
    MODIFIER_PROPERTY_TRANSLATE_ATTACK_SOUND = 231,
    /**
     * Method Name: `GetUnitLifetimeFraction`
     */
    MODIFIER_PROPERTY_LIFETIME_FRACTION = 232,
    /**
     * Method Name: `GetModifierProvidesFOWVision`
     */
    MODIFIER_PROPERTY_PROVIDES_FOW_POSITION = 233,
    /**
     * Method Name: `GetModifierSpellsRequireHP`
     */
    MODIFIER_PROPERTY_SPELLS_REQUIRE_HP = 234,
    /**
     * Method Name: `GetForceDrawOnMinimap`
     */
    MODIFIER_PROPERTY_FORCE_DRAW_MINIMAP = 235,
    /**
     * Method Name: `GetModifierDisableTurning`
     */
    MODIFIER_PROPERTY_DISABLE_TURNING = 236,
    /**
     * Method Name: `GetModifierIgnoreCastAngle`
     */
    MODIFIER_PROPERTY_IGNORE_CAST_ANGLE = 237,
    /**
     * Method Name: `GetModifierChangeAbilityValue`
     */
    MODIFIER_PROPERTY_CHANGE_ABILITY_VALUE = 238,
    /**
     * Method Name: `GetModifierOverrideAbilitySpecial`
     */
    MODIFIER_PROPERTY_OVERRIDE_ABILITY_SPECIAL = 239,
    /**
     * Method Name: `GetModifierOverrideAbilitySpecialValue`
     */
    MODIFIER_PROPERTY_OVERRIDE_ABILITY_SPECIAL_VALUE = 240,
    /**
     * Method Name: `GetModifierAbilityLayout`
     */
    MODIFIER_PROPERTY_ABILITY_LAYOUT = 241,
    /**
     * Method Name: `OnDominated`
     */
    MODIFIER_EVENT_ON_DOMINATED = 242,
    /**
     * Method Name: `OnKill`
     */
    MODIFIER_EVENT_ON_KILL = 243,
    /**
     * Method Name: `OnAssist`
     */
    MODIFIER_EVENT_ON_ASSIST = 244,
    /**
     * Method Name: `GetModifierTempestDouble`
     */
    MODIFIER_PROPERTY_TEMPEST_DOUBLE = 245,
    /**
     * Method Name: `PreserveParticlesOnModelChanged`
     */
    MODIFIER_PROPERTY_PRESERVE_PARTICLES_ON_MODEL_CHANGE = 246,
    /**
     * Method Name: `OnAttackFinished`
     */
    MODIFIER_EVENT_ON_ATTACK_FINISHED = 247,
    /**
     * Method Name: `GetModifierIgnoreCooldown`
     */
    MODIFIER_PROPERTY_IGNORE_COOLDOWN = 248,
    /**
     * Method Name: `GetModifierCanAttackTrees`
     */
    MODIFIER_PROPERTY_CAN_ATTACK_TREES = 249,
    /**
     * Method Name: `GetVisualZDelta`
     */
    MODIFIER_PROPERTY_VISUAL_Z_DELTA = 250,
    /**
     * Method Name: `GetVisualZSpeedBaseOverride`
     */
    MODIFIER_PROPERTY_VISUAL_Z_SPEED_BASE_OVERRIDE = 251,
    MODIFIER_PROPERTY_INCOMING_DAMAGE_ILLUSION = 252,
    /**
     * Method Name: `GetModifierNoVisionOfAttacker`
     */
    MODIFIER_PROPERTY_DONT_GIVE_VISION_OF_ATTACKER = 253,
    /**
     * Method Name: `OnTooltip2`
     */
    MODIFIER_PROPERTY_TOOLTIP2 = 254,
    /**
     * Method Name: `OnAttackRecordDestroy`
     */
    MODIFIER_EVENT_ON_ATTACK_RECORD_DESTROY = 255,
    /**
     * Method Name: `OnProjectileObstructionHit`
     */
    MODIFIER_EVENT_ON_PROJECTILE_OBSTRUCTION_HIT = 256,
    /**
     * Method Name: `GetSuppressTeleport`
     */
    MODIFIER_PROPERTY_SUPPRESS_TELEPORT = 257,
    /**
     * Method Name: `OnAttackCancelled`
     */
    MODIFIER_EVENT_ON_ATTACK_CANCELLED = 258,
    /**
     * Method Name: `GetSuppressCleave`
     */
    MODIFIER_PROPERTY_SUPPRESS_CLEAVE = 259,
    /**
     * Method Name: `BotAttackScoreBonus`
     */
    MODIFIER_PROPERTY_BOT_ATTACK_SCORE_BONUS = 260,
    /**
     * Method Name: `GetModifierAttackSpeedReductionPercentage`
     */
    MODIFIER_PROPERTY_ATTACKSPEED_REDUCTION_PERCENTAGE = 261,
    /**
     * Method Name: `GetModifierMoveSpeedReductionPercentage`
     */
    MODIFIER_PROPERTY_MOVESPEED_REDUCTION_PERCENTAGE = 262,
    MODIFIER_PROPERTY_ATTACK_WHILE_MOVING_TARGET = 263,
    /**
     * Method Name: `GetModifierAttackSpeedPercentage`
     */
    MODIFIER_PROPERTY_ATTACKSPEED_PERCENTAGE = 264,
    /**
     * Method Name: `OnAttemptProjectileDodge`
     */
    MODIFIER_EVENT_ON_ATTEMPT_PROJECTILE_DODGE = 265,
    /**
     * Method Name: `OnPreDebuffApplied`
     */
    MODIFIER_EVENT_ON_PREDEBUFF_APPLIED = 266,
    /**
     * Method Name: `GetModifierPercentageCooldownStacking`
     */
    MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE_STACKING = 267,
    /**
     * Method Name: `GetModifierSpellRedirectTarget`
     */
    MODIFIER_PROPERTY_SPELL_REDIRECT_TARGET = 268,
    /**
     * Method Name: `GetModifierTurnRateConstant`
     */
    MODIFIER_PROPERTY_TURN_RATE_CONSTANT = 269,
    /**
     * Method Name: `GetModifierIsRatPack`
     */
    MODIFIER_PROPERTY_RAT_PACK = 270,
    /**
     * Method Name: `GetModifierPhysicalDamageOutgoing_Percentage`
     */
    MODIFIER_PROPERTY_PHYSICALDAMAGEOUTGOING_PERCENTAGE = 271,
    /**
     * Method Name: `GetModifierKnockbackAmplification_Percentage`
     */
    MODIFIER_PROPERTY_KNOCKBACK_AMPLIFICATION_PERCENTAGE = 272,
    /**
     * Return value is a count of pips.
     *
     *
     *
     * Method Name: `GetModifierHealthBarPips`.
     */
    MODIFIER_PROPERTY_HEALTHBAR_PIPS = 273,
    /**
     * This property controls 'universal' shield, if defined both on client and
     * server. Return value on client should be current shield health, as a positive
     * integer, on server - amount of damage blocked.
     *
     *
     *
     * Method Name: `GetModifierIncomingDamageConstant`.
     */
    MODIFIER_PROPERTY_INCOMING_DAMAGE_CONSTANT = 274,
    /**
     * Method Name: `OnSpellAppliedSuccessfully`
     */
    MODIFIER_EVENT_SPELL_APPLIED_SUCCESSFULLY = 275,
    /**
     * Method Name: `GetModifierAvoidDamageAfterReductions`
     */
    MODIFIER_PROPERTY_AVOID_DAMAGE_AFTER_REDUCTIONS = 276,
    /**
     * Method Name: `GetModifierPropetyFailAttack`
     */
    MODIFIER_PROPERTY_FAIL_ATTACK = 277,
    /**
     * Method Name: `GetModifierPrereduceIncomingDamage_Mult`
     */
    MODIFIER_PROPERTY_PREREDUCE_INCOMING_DAMAGE_MULT = 278,
    /**
     * Method Name: `GetModifierSuppressFullscreenDeathFX`
     */
    MODIFIER_PROPERTY_SUPPRESS_FULLSCREEN_DEATH_FX = 279,
    /**
     * Method Name: `MODIFIER_PROPERTY_INCOMING_DAMAGE_CONSTANT_POST`
     */
    MODIFIER_PROPERTY_INCOMING_DAMAGE_CONSTANT_POST = 280,
    /**
     * Method Name: `GetModifierDamageOutgoing_PercentageMultiplicative`
     */
    MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_MULTIPLICATIVE = 281,
    /**
     * Method Name: `GetModifierTickGold_Multiplier`
     */
    MODIFIER_PROPERTY_TICK_GOLD_MULTIPLIER = 282,
    /**
     * Method Name: `GetModifierSlowResistance`
     */
    MODIFIER_PROPERTY_SLOW_RESISTANCE = 283,
    /**
     * Method Name: `GetModifierAoEBonusPercentage`
     */
    MODIFIER_PROPERTY_AOE_BONUS_PERCENTAGE = 284,
    /**
     * Method Name: `GetModifierProjectileSpeed`
     */
    MODIFIER_PROPERTY_PROJECTILE_SPEED = 285,
    /**
     * Method Name: `GetModifierBecomeUniversal`
     */
    MODIFIER_PROPERTY_BECOME_UNIVERSAL = 286,
    /**
     * Method Name: `OnForceProcMagicStick`
     */
    MODIFIER_EVENT_ON_FORCE_PROC_MAGIC_STICK = 287,
    /**
     * Method Name: `GetModifierDoNotSinkAfterDeath`
     */
    MODIFIER_PROPERTY_DO_NOT_SINK_AFTER_DEATH = 288,
    /**
     * Method Name: `OnDamageHPLoss`
     */
    MODIFIER_EVENT_ON_DAMAGE_HPLOSS = 289,
    /**
     * Method Name: `GetModifierForceMaxHealth`
     */
    MODIFIER_PROPERTY_FORCE_MAX_HEALTH = 290,
    /**
     * Method Name: `GetModifierAoEBonusConstant`
     */
    MODIFIER_PROPERTY_AOE_BONUS_CONSTANT = 291,
    MODIFIER_FUNCTION_LAST = 292,
    MODIFIER_FUNCTION_INVALID = 65535,
}