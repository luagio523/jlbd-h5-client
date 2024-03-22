

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



export enum ModifierFunction {
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

    // `GetModifierAvoidDamage`: 控制单位是否可以免疫某些类型的伤害。
    MODIFIER_PROPERTY_AVOID_DAMAGE = 68,

    // `GetModifierAvoidSpell`: 控制单位是否可以免疫魔法攻击。
    MODIFIER_PROPERTY_AVOID_SPELL = 69,

    // `GetModifierMiss_Percentage`: 提供减少命中几率的百分比。
    MODIFIER_PROPERTY_MISS_PERCENTAGE = 70,

    // `GetModifierPhysicalArmorBase_Percentage`: 提供基础物理护甲的增加百分比。
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE = 71,

    // `GetModifierPhysicalArmorBonus`: 提供额外的物理护甲加成。
    MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS = 73,

    // `GetModifierMagicalResistanceBaseReduction`: 提供基础魔法抗性的降低。
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BASE_REDUCTION = 79,

    // `GetModifierMagicalResistanceBonus`: 提供额外的魔法抗性加成。
    MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS = 81,

    // `GetModifierBaseRegen`: 更改单位的基础施法恢复率。
    MODIFIER_PROPERTY_BASE_MANA_REGEN = 85,

    // `GetModifierConstantManaRegen`:  提供常量法力回复速度。
    MODIFIER_PROPERTY_MANA_REGEN_CONSTANT = 86,

    // `GetModifierConstantHealthRegen`: 提供常量生命回复速度。
    MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT = 89,

    // `GetModifierHealthBonus`: 增加额外的生命值。
    MODIFIER_PROPERTY_HEALTH_BONUS = 92,

    // `GetModifierManaBonus`: 增加额外的法力值。
    MODIFIER_PROPERTY_MANA_BONUS = 93,

    // `GetModifierExtraStrengthBonus`: 提供额外的力量加成。
    MODIFIER_PROPERTY_EXTRA_STRENGTH_BONUS = 94,

    // `GetModifierBonusStats_Strength`: 提供额外的力量加成的统计数据。
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

    // `GetModifierAttackRangeOverride`: 覆盖攻击距离的基础值。
    MODIFIER_PROPERTY_ATTACK_RANGE_BASE_OVERRIDE = 110,

    // `GetModifierProjectileSpeedBonus`: 增加投射物的速度。
    MODIFIER_PROPERTY_PROJECTILE_SPEED_BONUS = 115,

    // `GetModifierProjectileName`: 更改投射物模型名字。
    MODIFIER_PROPERTY_PROJECTILE_NAME = 117,

    // `ReincarnateTime`: 决定单位的重生时间。
    MODIFIER_PROPERTY_REINCARNATION = 118,

    // `GetModifierConstantRespawnTime`: 修改单位的死亡复活时间。
    MODIFIER_PROPERTY_RESPAWNTIME = 120,

    // `GetModifierPercentageCooldown`: 修改技能冷却时间的百分比。
    MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE = 123,


    // `GetModifierMagical_ConstantBlock`: 提供一定量的魔法伤害阻挡。
    MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK = 136,

    // `GetModifierPhysical_ConstantBlock`: 提供一定量的物理伤害阻挡。
    MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK = 137,

    // `GetOverrideAnimation`: 改变单位的动画。
    MODIFIER_PROPERTY_OVERRIDE_ANIMATION = 141,

    // `GetAbsorbSpell`: 吸收一个单次技能的前提下。
    MODIFIER_PROPERTY_ABSORB_SPELL = 144,

    // `GetReflectSpell`: 反射一个单次技能的前提下。
    MODIFIER_PROPERTY_REFLECT_SPELL = 145,

    // `GetDisableAutoAttack`: 禁止单位自动攻击。
    MODIFIER_PROPERTY_DISABLE_AUTOATTACK = 146,

    // `GetBonusDayVision`: 增加单位的白天视野范围。
    MODIFIER_PROPERTY_BONUS_DAY_VISION = 147,

    // `GetFixedDayVision`: 设置单位的白天固定视野范围。
    MODIFIER_PROPERTY_FIXED_DAY_VISION = 152,

    // `GetMinHealth`: 设置单位的最小生命值。
    MODIFIER_PROPERTY_MIN_HEALTH = 154,

    // `GetIsIllusion`: 标记单位为幻象。
    MODIFIER_PROPERTY_IS_ILLUSION = 158,

    // `GetModifierTurnRate_Percentage`: 改变单位的转身速率百分比。
    MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE = 164,

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

    // `OnAbilityFullyCast`: 当一个技能完成施法时（有效释放）触发。
    MODIFIER_EVENT_ON_ABILITY_FULLY_CAST = 192,

    // `OnTakeDamage`: 当单位承受伤害时触发。
    MODIFIER_EVENT_ON_TAKEDAMAGE = 197,

    // `OnStateChanged`: 当单位的状态改变时触发（例如：隐身、缴械等）。
    MODIFIER_EVENT_ON_STATE_CHANGED = 199,

    // `OnAttacked`: 当单位受到攻击时触发。
    MODIFIER_EVENT_ON_ATTACKED = 204,

    // `OnDeath`: 当单位死亡时触发。
    MODIFIER_EVENT_ON_DEATH = 205,

    // `OnRespawn`: 当单位复活时触发。
    MODIFIER_EVENT_ON_RESPAWN = 207,

    // `OnTeleporting`: 当单位开始传送时触发。
    MODIFIER_EVENT_ON_TELEPORTING = 210,

    // `OnTeleported`: 当单位传送完成时触发。
    MODIFIER_EVENT_ON_TELEPORTED = 211,

    // `OnSetLocation`: 当单位位置被强制改变时触发。
    MODIFIER_EVENT_ON_SET_LOCATION = 212,

    // `OnHealthGained`: 当单位获得生命值时触发。
    MODIFIER_EVENT_ON_HEALTH_GAINED = 213,

    // `OnManaGained`: 当单位获得法力值时触发。
    MODIFIER_EVENT_ON_MANA_GAINED = 214,

    // `OnModifierAdded`: 当有新的修饰器（Modifier）被加到单位上时触发。
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

    // `GetModifierSlowResistance`: 提供单位抵抗减速效果的能力。
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