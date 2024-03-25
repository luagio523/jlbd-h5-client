export enum DamageType {
    DAMAGE_TYPE_NONE = 0, // 无伤害类型
    DAMAGE_TYPE_PHYSICAL = 1, // 物理伤害类型，一般受装甲抵消
    DAMAGE_TYPE_MAGICAL = 2, // 魔法伤害类型，一般受魔法抗性抵消
    DAMAGE_TYPE_PURE = 4, // 纯粹伤害类型，无视一切抵消
    DAMAGE_TYPE_ALL = 7, // 所有伤害类型
    DAMAGE_TYPE_HP_REMOVAL = 8, // 移除生命值伤害类型，直接扣血，不受任何抵消影响，无法触发'受伤害'条件
    DAMAGE_TYPE_ABILITY_DEFINED = 22, // 技能定义的伤害类型，该类型伤害由技能直接定义，可能有特殊的计算或免疫规则
}



export enum DamageFlag {
    // 没有特殊伤害标志
    DOTA_DAMAGE_FLAG_NONE = 0,
    // 忽略魔法护甲
    DOTA_DAMAGE_FLAG_IGNORES_MAGIC_ARMOR = 1 << 0,
    // 忽略物理护甲
    DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR = 1 << 1,
    // 绕过无敌状态
    DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY = 1 << 2,
    // 绕过格挡效果
    DOTA_DAMAGE_FLAG_BYPASSES_BLOCK = 1 << 3,
    // 反射伤害标志
    DOTA_DAMAGE_FLAG_REFLECTION = 1 << 4,
    // 伤害导致的生命值减少，不考虑实际伤害值
    DOTA_DAMAGE_FLAG_HPLOSS = 1 << 5,
    // 不触发导演事件
    DOTA_DAMAGE_FLAG_NO_DIRECTOR_EVENT = 1 << 6,
    // 非致命伤害，不会导致死亡
    DOTA_DAMAGE_FLAG_NON_LETHAL = 1 << 7,
    // 无伤害倍增器
    DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS = 1 << 9,
    // 无法通过法术增强来增加伤害
    DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION = 1 << 10,
    // 如果伤害来源隐藏，则不显示伤害
    DOTA_DAMAGE_FLAG_DONT_DISPLAY_DAMAGE_IF_SOURCE_HIDDEN = 1 << 11,
    // 伤害不会产生法术吸血效果
    DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL = 1 << 12,
    // 火属性伤害
    DOTA_DAMAGE_FLAG_PROPERTY_FIRE = 1 << 13,
    // 忽略基础物理护甲
    DOTA_DAMAGE_FLAG_IGNORES_BASE_PHYSICAL_ARMOR = 1 << 14,
    // 次要投射物攻击
    DOTA_DAMAGE_FLAG_SECONDARY_PROJECTILE_ATTACK = 1 << 15,
    // 强制法术增强效果
    DOTA_DAMAGE_FLAG_FORCE_SPELL_AMPLIFICATION = 1 << 16,
    // 魔法自动攻击(法师攻击)
    DOTA_DAMAGE_FLAG_MAGIC_AUTO_ATTACK = 1 << 17,
    // 攻击修饰符
    DOTA_DAMAGE_FLAG_ATTACK_MODIFIER = 1 << 18,
}