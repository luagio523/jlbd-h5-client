export enum AbilityBehavior {
    ABILITY_BEHAVIOR_HIDDEN = 1 << 0, //可以被单位拥有，但不能施放，也不会显示在HUD上。
    ABILITY_BEHAVIOR_PASSIVE = 1 << 1, //不能像上面那样施放，但这个会显示在能力HUD上。
    ABILITY_BEHAVIOR_NO_TARGET = 1 << 2, //不需要施放目标，按下按钮后技能就会发射。
    ABILITY_BEHAVIOR_UNIT_TARGET = 1 << 3, //需要一个施法目标。
    ABILITY_BEHAVIOR_POINT = 1 << 4, //可以在鼠标光标所在的任何地方施放（如果单击一个单位，它只会在该单位站立的地方施放）。
    ABILITY_BEHAVIOR_AOE = 1 << 5, //绘制技能生效的半径。有点像 POINT，但有一个效果区域显示。
    ABILITY_BEHAVIOR_NOT_LEARNABLE = 1 << 6, //可能可以施放或有施放方案但无法学习（这些通常是暂时的能力，如技术人员的炸弹爆炸）。
    ABILITY_BEHAVIOR_CHANNELLED = 1 << 7, //通道能力。如果用户移动或沉默，该能力就会中断。
    ABILITY_BEHAVIOR_ITEM = 1 << 8, //能力与物品相关。
    ABILITY_BEHAVIOR_TOGGLE = 1 << 9, //可以即时切换。
    ABILITY_BEHAVIOR_DIRECTIONAL = 1 << 10, //具有来自英雄的方向，例如米拉纳斯之箭或帕吉的钩子。
    ABILITY_BEHAVIOR_IMMEDIATE = 1 << 11, //无需进入动作队列即可立即使用。
    ABILITY_BEHAVIOR_AUTOCAST = 1 << 12, //可以自动施放。
    ABILITY_BEHAVIOR_NOASSIST = 1 << 13, //技能没有十字线辅助。
    ABILITY_BEHAVIOR_AURA = 1 << 14, //能力是一种光环。除了标记该能力之外，没有真正使用过。
    ABILITY_BEHAVIOR_ATTACK = 1 << 15, //是一次攻击，无法击中免疫攻击的目标。
    ABILITY_BEHAVIOR_DONT_RESUME_MOVMENT = 1 << 16, //完成后不应恢复移动。仅适用于无目标、非即时能力。
    ABILITY_BEHAVIOR_ROOT_DISABLES = 1 << 17, //root时无法使用
    ABILITY_BEHAVIOR_UNRESTRICTED = 1 << 18, //命令受限时允许使用
    ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE = 1 << 19, //可以在击晕、施法或强制时执行-攻击。仅适用于切换能力。
    ABILITY_BEHAVIOR_IGNORE_CHANNEL = 1 << 20, //可以在不中断通道的情况下执行。
    ABILITY_BEHAVIOR_DONT_ALERT_TARGET = 1 << 22, //对敌人施放目标时不警告敌人。
    ABILITY_BEHAVIOR_DONT_RESUME_ATTACK = 1 << 23, //技能完成后不应恢复对先前目标的命令攻击。仅适用于无目标、非直接能力和单位目标能力。
    ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN = 1 << 24, //技能被盗时仍使用其正常施法点。
    ABILITY_BEHAVIOR_IGNORE_BACKSWING = 1 << 25, //技能忽略后摆伪队列。
    ABILITY_BEHAVIOR_RUNE_TARGET = 1 << 26, //目标符文。
}



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


export enum UnitTargetFlags {
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


export enum AbilityType {
    ABILITY_TYPE_BASIC = 0, //基础技能。英雄的主要技能，通常有3个。
    ABILITY_TYPE_ULTIMATE = 1, //终极技能。通常是英雄的第四个技能，通常在英雄达到一定等级时才能解锁。
    ABILITY_TYPE_ATTRIBUTES = 2, //属性技能。在某些游戏中，英雄的属性可以作为技能升级，增加英雄的基础属性。
    ABILITY_TYPE_HIDDEN = 3, //隐藏技能。这是不会在技能面板上显示的技能，可能是被动技能，或者是特定场景下才会触发的技能。
}


export enum DamageType {
    DAMAGE_TYPE_NONE = 0,
    DAMAGE_TYPE_PHYSICAL = 1,
    DAMAGE_TYPE_MAGICAL = 2,
    DAMAGE_TYPE_PURE = 4,
    DAMAGE_TYPE_ALL = 7,
    DAMAGE_TYPE_HP_REMOVAL = 8,
    DAMAGE_TYPE_ABILITY_DEFINED = 22,
}


export enum AttackCapability {
   UNIT_CAP_NO_ATTACK = 0,
   UNIT_CAP_MELEE_ATTACK = 1,
   UNIT_CAP_RANGED_ATTACK = 2,
   UNIT_ATTACK_CAPABILITY_BIT_COUNT = 3,
   UNIT_CAP_RANGED_ATTACK_DIRECTIONAL = 4,
}


export enum MoveCapability {
   UNIT_CAP_MOVE_NONE = 0,
   UNIT_CAP_MOVE_GROUND = 1,
   UNIT_CAP_MOVE_FLY = 2,
}


export enum ClickBehavior {
    CLICK_BEHAVIOR_NONE = 0,
    CLICK_BEHAVIOR_MOVE = 1,
    CLICK_BEHAVIOR_ATTACK = 2,
    CLICK_BEHAVIOR_CAST = 3,
    CLICK_BEHAVIOR_DROP_ITEM = 4,
    CLICK_BEHAVIOR_DROP_SHOP_ITEM = 5,
    CLICK_BEHAVIOR_DRAG = 6,
    CLICK_BEHAVIOR_LEARN_ABILITY = 7,
    CLICK_BEHAVIOR_PATROL = 8,
    CLICK_BEHAVIOR_VECTOR_CAST = 9,
    CLICK_BEHAVIOR_UNUSED = 10,
    CLICK_BEHAVIOR_RADAR = 11,
    CLICK_BEHAVIOR_LAST = 12,
}


