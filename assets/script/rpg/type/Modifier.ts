

export enum ModifierAttribute {
    MODIFIER_ATTRIBUTE_NONE = 0,    // 无特性。默认情况下，Modifier不具有任何属性。
    MODIFIER_ATTRIBUTE_PERMANENT = 1,   // 永久性。Modifier不会被驱散。
    MODIFIER_ATTRIBUTE_MULTIPLE = 2,    // 可叠加。允许多个相同的Modifier存在于一个单位上。
    MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE = 4,  // 忽略无敌。在施加Modifier时，会忽略目标单位的无敌状态。
    MODIFIER_ATTRIBUTE_AURA_PRIORITY = 8,   // 光环优先。在排序Modifier列表时，光环Modifier将总是排在非光环Modifier前面。
    MODIFIER_ATTRIBUTE_IGNORE_DODGE = 16,   // 忽略闪避。Modifier的效果不会被目标单位的闪避能力或异界混沌骑士的幻象效果影响。
}


export enum ModifierState {
    MODIFIER_STATE_ROOTED = 0, // 被固定：无法移动，但可以攻击和施放技能
    MODIFIER_STATE_DISARMED = 1, // 被缴械：无法进行攻击
    MODIFIER_STATE_ATTACK_IMMUNE = 2, // 攻击免疫：不会受到任何攻击的伤害
    MODIFIER_STATE_SILENCED = 3, // 沉默：无法施放技能
    MODIFIER_STATE_MUTED = 4, // 禁言：无法使用物品
    MODIFIER_STATE_STUNNED = 5, // 眩晕：无法进行任何操作
    MODIFIER_STATE_HEXED = 6, // 变形：变成小动物，无法移动，攻击和施放技能
    MODIFIER_STATE_INVISIBLE = 7, // 隐身：对敌人不可见
    MODIFIER_STATE_INVULNERABLE = 8, // 无敌：免疫所有伤害和效果
    MODIFIER_STATE_MAGIC_IMMUNE = 9, // 魔法免疫：免疫所有魔法伤害
    MODIFIER_STATE_PROVIDES_VISION = 10, // 提供视线：无论在哪，都能提供视野
    MODIFIER_STATE_NIGHTMARED = 11, // 噩梦：在噩梦状态期间无法指定自己的动作,任何伤害可以清醒
    MODIFIER_STATE_BLOCK_DISABLED = 12, // 阻挡禁用：无法阻挡敌人的行动
    MODIFIER_STATE_EVADE_DISABLED = 13, // 无法闪避
    MODIFIER_STATE_UNSELECTABLE = 14, // 无法选择：无法被玩家选中或者神符点击
    MODIFIER_STATE_CANNOT_TARGET_ENEMIES = 15, // 无法攻击敌人
    MODIFIER_STATE_CANNOT_TARGET_BUILDINGS = 16, // 无法攻击建筑
    MODIFIER_STATE_CANNOT_MISS = 17, // 无法错过：类似到千仞落等硬直的状态
    MODIFIER_STATE_SPECIALLY_DENIABLE = 18, // 可以被友方拒绝：在生命值低过某个值的时候，会被队友击杀
    MODIFIER_STATE_FROZEN = 19, // 冻住：无法移动，物理攻击和施放大部分技能
    MODIFIER_STATE_COMMAND_RESTRICTED = 20,  // 控制受限：不响应玩家的命令
    MODIFIER_STATE_NOT_ON_MINIMAP = 21, // 不显示在小地图上
    MODIFIER_STATE_LOW_ATTACK_PRIORITY = 22, // 被设计成低优先级目标
    MODIFIER_STATE_NO_HEALTH_BAR = 23, // 没有生命条
    MODIFIER_STATE_NO_HEALTH_BAR_FOR_ENEMIES = 24, // 不能为敌方看见生命条
    MODIFIER_STATE_NO_HEALTH_BAR_FOR_OTHER_PLAYERS = 25, // 不能为其他玩家看见生命条
    MODIFIER_STATE_FLYING = 26, // 飞行：无视所有地形
    MODIFIER_STATE_NO_UNIT_COLLISION = 27, // 无碰撞体积，自身可以和英雄和小兵重叠在一块
    MODIFIER_STATE_NO_TEAM_MOVE_TO = 28, // 禁止队友向你移动
    MODIFIER_STATE_NO_TEAM_SELECT = 29, // 禁止队友选择你
    MODIFIER_STATE_PASSIVES_DISABLED = 30, // 被动失效，失去被动技能效果
    MODIFIER_STATE_DOMINATED = 31, // 被控制：你的动作由其他玩家控制
    MODIFIER_STATE_BLIND = 32, // 盲目 - 自己的攻击会失效
    MODIFIER_STATE_OUT_OF_GAME = 33, // 游戏之外：无法被选中，攻击或施法
    MODIFIER_STATE_FAKE_ALLY = 34, // 假的盟友：显示为友军，但可能被自己人误伤
    MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY = 35, // 仅用于寻路的飞行：暂时没有被使用
    MODIFIER_STATE_TRUESIGHT_IMMUNE = 36, // 真视免疫：无法被敌方真视侦测
    MODIFIER_STATE_UNTARGETABLE = 37, // 不能被选中：无法被敌我选中
    MODIFIER_STATE_UNTARGETABLE_ALLIED = 38, // 不能被我方选中
    MODIFIER_STATE_UNTARGETABLE_ENEMY = 39, // 不能被敌方选中
    MODIFIER_STATE_UNTARGETABLE_SELF = 40, // 不能选中自己
    MODIFIER_STATE_IGNORING_MOVE_AND_ATTACK_ORDERS = 41, // 忽视移动和攻击指令
    MODIFIER_STATE_ALLOW_PATHING_THROUGH_TREES = 42, // 允许通过树木：无视树木地形
    MODIFIER_STATE_NOT_ON_MINIMAP_FOR_ENEMIES = 43, // 未显示在敌方小地图上
    MODIFIER_STATE_UNSLOWABLE = 44, // 不可减速：暂时没有被使用
    MODIFIER_STATE_TETHERED = 45, // 束缚：和另一个单位相绑定，会跟随其移动
    MODIFIER_STATE_IGNORING_STOP_ORDERS = 46, // 忽略停止命令
    MODIFIER_STATE_FEARED = 47, // 恐惧：将在一段时间内失去对单位的控制权，使其朝着基地位置移动
    MODIFIER_STATE_TAUNTED = 48, // 嘲讽：强制单位攻击你，无法控制单位行动
    MODIFIER_STATE_CANNOT_BE_MOTION_CONTROLLED = 49, // 无法被动态控制：不能被击飞，吟唱也不会被打断
    MODIFIER_STATE_FORCED_FLYING_VISION = 50, // 强制飞行视野：获取飞行视野
    MODIFIER_STATE_ATTACK_ALLIES = 51, // 攻击盟友：可以攻击己方单位
    MODIFIER_STATE_ALLOW_PATHING_THROUGH_CLIFFS = 52, // 允许穿过悬崖：无视悬崖地形
    MODIFIER_STATE_ALLOW_PATHING_THROUGH_FISSURE = 53, // 允许穿过裂缝：无视裂缝地形
    MODIFIER_STATE_SPECIALLY_UNDENIABLE = 54, // 可以特别否认
    MODIFIER_STATE_ALLOW_PATHING_THROUGH_OBSTRUCTIONS = 55, // 允许通过障碍：无视障碍物
    MODIFIER_STATE_DEBUFF_IMMUNE = 56, // 免疫减益：不会受到任何不良状态
    MODIFIER_STATE_NO_INVISIBILITY_VISUALS = 57, // 没有隐身视觉效果
    MODIFIER_STATE_ALLOW_PATHING_THROUGH_BASE_BLOCKER = 58, // 允许通过基础阻拦物：针对基地的阻止物无效，可以自由通过
    MODIFIER_STATE_IGNORING_MOVE_ORDERS = 59, // 忽视移动命令
    MODIFIER_STATE_LAST = 60, // 这是枚举的最后一项，不表示任何状态
}







export enum modifierfunction {
       // `GetModifierPreAttack_BonusDamage`: Hero在攻击前获取额外的伤害。
       MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE = 0,

       // `GetModifierPreAttack_BonusDamage_Target`: Hero在攻击特定目标前获取额外的伤害。
       MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET = 1,
   
       // `GetModifierPreAttack_BonusDamage_Proc`: Hero在攻击被处理之前获取额外的伤害。
       MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PROC = 2,
   
       // `GetModifierPreAttack_BonusDamagePostCrit`: 伤害会在攻击后的暴击伤害计算中被考虑进去。
       MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT = 3,
   
       // `GetModifierBaseAttack_BonusDamage`: 获取到基础攻击额外的伤害。
       MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE = 4,
   
       // `GetModifierProcAttack_BonusDamage_Physical`: 获取物理伤害的攻击加成。
       MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL = 5,
   
       // `GetModifierProcAttack_ConvertPhysicalToMagical`: 将物理伤害转变为魔法伤害。
       MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL = 6,
   
       // `GetModifierProcAttack_BonusDamage_Magical`: 获取魔法伤害的攻击加成。
       MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL = 7,
   
       // `GetModifierOverrideAttackDamage`: 重写所有伤害源。
       MODIFIER_PROPERTY_OVERRIDE_ATTACK_DAMAGE = 11,
   
       // `GetModifierInvisibilityLevel`: 定义单位的隐形级别。
       MODIFIER_PROPERTY_INVISIBILITY_LEVEL = 13,
   
       // `GetModifierPersistentInvisibility`: 让单位持续隐形。
       MODIFIER_PROPERTY_PERSISTENT_INVISIBILITY = 15,
   
       // `GetModifierMoveSpeedBonus_Constant`: 获取移动速度的加成。
       MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT = 16,
   
       // `GetModifierMoveSpeedOverride`: 覆盖基础移动速度。
       MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE = 17,
   
       // `GetModifierIgnoreMovespeedLimit`: 忽略移动速度限制。
       MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT = 27,
   
       // `GetModifierMoveSpeed_Limit`: 设定移动速度的上限。
       MODIFIER_PROPERTY_MOVESPEED_LIMIT = 28,
   
       // `GetModifierAttackSpeedBaseOverride`: 获取基础攻击速度的加成。
       MODIFIER_PROPERTY_ATTACKSPEED_BASE_OVERRIDE = 29,
   
       // `GetModifierFixedAttackRate`: 获取单位固定的攻击速度。
       MODIFIER_PROPERTY_FIXED_ATTACK_RATE = 30,
   
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
    
        // `GetModifierHealAmplify_PercentageSource`: 提高单位对其他单位的治疗效果的百分比。
        MODIFIER_PROPERTY_HEAL_AMPLIFY_PERCENTAGE_SOURCE = 48,
    
        // `GetModifierHPRegenAmplify_Percentage`: 提高单位治疗效果的百分比。
        MODIFIER_PROPERTY_HP_REGEN_AMPLIFY_PERCENTAGE = 51,
    
        // `GetModifierLifestealRegenAmplify_Percentage`: 提高单位的吸血效果的百分比。
        MODIFIER_PROPERTY_LIFESTEAL_AMPLIFY_PERCENTAGE = 52,
    
        // `GetModifierMPRegenAmplify_Percentage`: 提高单位的法力恢复速度的百分比。
        MODIFIER_PROPERTY_MP_REGEN_AMPLIFY_PERCENTAGE = 54,
    
        // `GetModifierIncomingDamage_Percentage`: 改变单位受到的伤害的百分比。
        MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE = 59,
    
        // `GetModifierIncomingPhysicalDamage_Percentage`: 改变单位受到的物理伤害的百分比。
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