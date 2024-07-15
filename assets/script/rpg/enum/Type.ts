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




export enum AbilityType {
    ABILITY_TYPE_BASIC = 0, //基础技能。英雄的主要技能，通常有3个。
    ABILITY_TYPE_ULTIMATE = 1, //终极技能。通常是英雄的第四个技能，通常在英雄达到一定等级时才能解锁。
    ABILITY_TYPE_ATTRIBUTES = 2, //属性技能。在某些游戏中，英雄的属性可以作为技能升级，增加英雄的基础属性。
    ABILITY_TYPE_HIDDEN = 3, //隐藏技能。这是不会在技能面板上显示的技能，可能是被动技能，或者是特定场景下才会触发的技能。
}

export enum AttackType {
    HeroAttack,      // 英雄攻击，通常对所有目标都有一致效果
    BasicAttack,     // 基础攻击，一般为多数单位的攻击类型
    PierceAttack,    // 穿刺攻击，对某些目标有更高效果
    SiegeAttack,     // 攻城攻击，对建筑物造成更多伤害
    ChaosAttack,     // 混沌攻击，对所有单位类型都造成全额伤害
    MagicAttack      // 魔法攻击，非常规的攻击类型，通常利用技能模仿
}

export enum AttributeType {
    STRENGTH,
    AGILITY,
    INTELLECT
}


export enum AttributeDerivedStats {
    ATTRIBUTE_STRENGTH_DAMAGE = 0,
    ATTRIBUTE_STRENGTH_HP = 1,
    ATTRIBUTE_STRENGTH_HP_REGEN = 2,
    ATTRIBUTE_AGILITY_DAMAGE = 3,
    ATTRIBUTE_AGILITY_ARMOR = 4,
    ATTRIBUTE_AGILITY_ATTACK_SPEED = 5,
    ATTRIBUTE_INTELLIGENCE_DAMAGE = 6,
    ATTRIBUTE_INTELLIGENCE_MANA = 7,
    ATTRIBUTE_INTELLIGENCE_MANA_REGEN = 8,
    ATTRIBUTE_INTELLIGENCE_MAGIC_RESIST = 9,
    ATTRIBUTE_ALL_DAMAGE = 10,
}


export enum Attributes {
    ATTRIBUTE_INVALID = -1,
    ATTRIBUTE_STRENGTH = 0,
    ATTRIBUTE_AGILITY = 1,
    ATTRIBUTE_INTELLECT = 2,
    ATTRIBUTE_ALL = 3,
    ATTRIBUTE_MAX = 4,
}



export enum AttackCapability {
    UNIT_CAP_NO_ATTACK = 0, // 单位无法进行攻击 这一选项常见于被禁止攻击的单位或某些特殊的非攻击单位，如观察守卫。
    UNIT_CAP_MELEE_ATTACK = 1, // 单位具有近战攻击能力。这一选项适用于像斯温这样的近战英雄。
    UNIT_CAP_RANGED_ATTACK = 2, // 单位具有远程攻击能力。这适用于像风行者这样的远程英雄。
    UNIT_ATTACK_CAPABILITY_BIT_COUNT = 3, // 确定单位攻击能力选项的数量
    UNIT_CAP_RANGED_ATTACK_DIRECTIONAL = 4, // 单位具有定向的远程攻击能力 单位具有定向的远程攻击能力。这个选项适用于需要定向攻击的单位或技能。
}


export enum ClickBehavior {
    CLICK_BEHAVIOR_NONE = 0, // 无点击行为
    CLICK_BEHAVIOR_MOVE = 1, // 点击移动行为
    CLICK_BEHAVIOR_ATTACK = 2, // 点击攻击行为
    CLICK_BEHAVIOR_CAST = 3, // 点击释放技能行为
    CLICK_BEHAVIOR_DROP_ITEM = 4, // 点击丢弃物品行为
    CLICK_BEHAVIOR_DROP_SHOP_ITEM = 5, // 点击丢弃商店物品行为
    CLICK_BEHAVIOR_DRAG = 6, // 点击拖动行为
    CLICK_BEHAVIOR_LEARN_ABILITY = 7, // 点击学习技能行为
    CLICK_BEHAVIOR_PATROL = 8, // 点击巡逻行为
    CLICK_BEHAVIOR_VECTOR_CAST = 9, // 点击向量施法行为
    CLICK_BEHAVIOR_UNUSED = 10, // 留空点击行为
    CLICK_BEHAVIOR_RADAR = 11, // 点击雷达行为
    CLICK_BEHAVIOR_LAST = 12, // 代表列表的结束，并不代表实际的行为
}





export enum EntityType {
    Default,
    Hero,
    NPC,
    Monster,
    Creep, // 野怪
    Building,
    Item
    // 可以根据需要添加更多实体类型
}


