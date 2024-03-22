
export enum Attributes {
    ATTRIBUTE_INVALID = -1, // 无效属性，通常用作错误值或未初始化的标记
    ATTRIBUTE_STRENGTH = 0, // 力量属性，一般与增加生命值和生命恢复相关
    ATTRIBUTE_AGILITY = 1,  // 敏捷属性，一般与增加攻击速度和闪避几率相关
    ATTRIBUTE_INTELLECT = 2,// 智力属性，一般与增加魔法值和魔法恢复相关
    ATTRIBUTE_ALL = 3,      // 通用属性，可能指代所有属性或在增益效果中影响全部上述属性
    ATTRIBUTE_MAX = 4,      // 用作枚举的上限标记，通常用于循环遍历或条件判断
}


export enum AttributeDerivedStats {
    ATTRIBUTE_STRENGTH_DAMAGE = 0,           // 力量提供的额外物理伤害
    ATTRIBUTE_STRENGTH_HP = 1,               // 力量提供的额外生命值
    ATTRIBUTE_STRENGTH_HP_REGEN = 2,         // 力量提供的生命恢复速度
    ATTRIBUTE_AGILITY_DAMAGE = 3,            // 敏捷提供的额外物理伤害
    ATTRIBUTE_AGILITY_ARMOR = 4,             // 敏捷提供的额外护甲值
    ATTRIBUTE_AGILITY_ATTACK_SPEED = 5,      // 敏捷提供的额外攻击速度
    ATTRIBUTE_INTELLIGENCE_DAMAGE = 6,       // 智力提供的额外物理伤害
    ATTRIBUTE_INTELLIGENCE_MANA = 7,         // 智力提供的额外魔法值
    ATTRIBUTE_INTELLIGENCE_MANA_REGEN = 8,   // 智力提供的魔法恢复速度
    ATTRIBUTE_INTELLIGENCE_MAGIC_RESIST = 9, // 智力提供的魔法抗性
    ATTRIBUTE_ALL_DAMAGE = 10,               // 所有属性提供的额外伤害
}



export enum AttackCapability {
    UNIT_CAP_NO_ATTACK = 0, // 单位无攻击能力
    UNIT_CAP_MELEE_ATTACK = 1, // 单位具有近战攻击能力
    UNIT_CAP_RANGED_ATTACK = 2, // 单位具有远程攻击能力
    UNIT_ATTACK_CAPABILITY_BIT_COUNT = 3, // 统计单位拥有的攻击能力数量
    UNIT_CAP_RANGED_ATTACK_DIRECTIONAL = 4, // 单位具有定向的远程攻击能力
}

export enum MoveCapability {
    UNIT_CAP_MOVE_NONE = 0, // 单位无移动能力
    UNIT_CAP_MOVE_GROUND = 1, // 单位可以在地面上移动
    UNIT_CAP_MOVE_FLY = 2, // 单位可以飞行，无视地形
}
