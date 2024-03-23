
export enum UnitTargetTeam {
    UNIT_TARGET_TEAM_NONE = 0, // 没有特定目标队伍。这可能用于无目标技能或全屏技能。
    UNIT_TARGET_TEAM_FRIENDLY = 1, // 友方队伍。这是指技能或效果目标为自己队伍的单位。
    UNIT_TARGET_TEAM_ENEMY = 2, // 敌方队伍。这是指技能或效果目标为敌人队伍的单位
    UNIT_TARGET_TEAM_BOTH = 3, // 友方和敌方队伍。这可能用于同时对友方和敌方队伍产生影响的技能或效果。
    UNIT_TARGET_TEAM_CUSTOM = 4, // 支持通过自定义代码指定具体的队伍作为目标的技能或效果
}

export enum UnitTargetType {
    UNIT_TARGET_NONE =  1 << 0, // 没有目标单位
    UNIT_TARGET_HERO = 1 << 1, // 目标是英雄单位
    UNIT_TARGET_CREEP = 1 << 2, // 目标是小兵单位，包括敌方和友方的小兵
    UNIT_TARGET_BUILDING = 1 << 3, // 目标是建筑单位，比如箭塔、兵营等
    UNIT_TARGET_COURIER = 1 << 4, // 目标是信使
    UNIT_TARGET_BASIC = 1 << 5, // 目标是基础单位，一般指小兵或中立单位
    UNIT_TARGET_OTHER = 1 << 6, // 目标是其他类型的单位
    UNIT_TARGET_ALL = 1 << 7, // 可以瞄准任何类型的单位
    UNIT_TARGET_TREE = 1 << 8, // 目标是树木，某些技能开发者会设定影响树木的技能
    UNIT_TARGET_CUSTOM = 1 << 9, // 目标是定制单位，可能是某些特殊活动、模式或版本中的特别单位
    UNIT_TARGET_SELF = 1 << 10, // 目标是自身
}


export enum UnitTargetFlag {
    UNIT_TARGET_FLAG_NONE = 1 << 0, // 没有特殊目标标志
    UNIT_TARGET_FLAG_RANGED_ONLY = 1 << 1, // 只能选定远程单位
    UNIT_TARGET_FLAG_MELEE_ONLY = 1 << 2, // 只能选定近战单位
    UNIT_TARGET_FLAG_DEAD = 1 << 3, // 可以选定已死亡的单位
    UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES = 1 << 4, // 可以选定具有魔法免疫的敌方单位
    UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES = 1 << 5, // 可以选定不具有魔法免疫的友方单位
    UNIT_TARGET_FLAG_INVULNERABLE = 1 << 6, // 可以选定具有无敌状态的单位
    UNIT_TARGET_FLAG_FOW_VISIBLE = 1 << 7, // 目标必须在视野内
    UNIT_TARGET_FLAG_NO_INVIS = 1 << 8, // 不可以选定隐身的单位
    UNIT_TARGET_FLAG_NOT_ANCIENTS = 1 << 9, // 不可以选定远古生物
    UNIT_TARGET_FLAG_PLAYER_CONTROLLED = 1 << 10, // 可以选定玩家控制的单位
    UNIT_TARGET_FLAG_NOT_DOMINATED = 1 << 11, // 不可以选定被支配的单位
    UNIT_TARGET_FLAG_NOT_SUMMONED = 1 << 12, // 不可以选定被召唤的单位
    UNIT_TARGET_FLAG_NOT_ILLUSIONS = 1 << 13, // 不可以选定幻影单位
    UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE = 1 << 14, // 不可以选择攻击免疫的单位
    UNIT_TARGET_FLAG_MANA_ONLY = 1 << 15, // 只能选择有魔法值的单位
    UNIT_TARGET_FLAG_CHECK_DISABLE_HELP = 1 << 16, // 检查是否禁止帮助
    UNIT_TARGET_FLAG_NOT_CREEP_HERO = 1 << 17, // 不可以选择小兵英雄
    UNIT_TARGET_FLAG_OUT_OF_WORLD = 1 << 18, // 可以选择在游戏区域外的单位
    UNIT_TARGET_FLAG_NOT_NIGHTMARED = 1 << 19, // 不可以选择在噩梦状态的单位
    UNIT_TARGET_FLAG_PREFER_ENEMIES = 1 << 20, // 优先选择敌方单位
    UNIT_TARGET_FLAG_RESPECT_OBSTRUCTIONS = 1 << 21, // 尊重地形阻挡
}
