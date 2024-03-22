class Item {
    constructor(id, name, type, description) {
        this.id = id;             // 物品唯一标识
        this.name = name;         // 物品名称
        this.type = type;         // 物品类型（装备，消耗品，材料等）
        this.description = description; // 物品描述
    }

    use() {
        // 定义物品的使用方法，根据不同类型的物品，其逻辑会有所不同
    }
}



enum Attributes {
    ATTRIBUTE_INVALID = -1, // 无效属性，通常用作错误值或未初始化的标记
    ATTRIBUTE_STRENGTH = 0, // 力量属性，一般与增加生命值和生命恢复相关
    ATTRIBUTE_AGILITY = 1,  // 敏捷属性，一般与增加攻击速度和闪避几率相关
    ATTRIBUTE_INTELLECT = 2,// 智力属性，一般与增加魔法值和魔法恢复相关
    ATTRIBUTE_ALL = 3,      // 通用属性，可能指代所有属性或在增益效果中影响全部上述属性
    ATTRIBUTE_MAX = 4,      // 用作枚举的上限标记，通常用于循环遍历或条件判断
}



// 定义枚举来表示角色的属性类型
enum AttributeType {
    /** 力量：增加生命值和每秒生命恢复 */
    Strength = 'strength',
    
    /** 敏捷：增加攻击速度和护甲 */
    Agility = 'agility',
    
    /** 智力：增加魔法值和每秒魔法恢复 */
    Intelligence = 'intelligence',
    
    /** 主属性：决定了英雄的主攻击属性 */
    MainAttribute = 'mainAttribute',
    
    // League of Legends Specific Attributes
    /** 生命值：角色的总生命 */
    Health = 'health',
    
    /** 魔法值：角色使用技能所需的资源 */
    Mana = 'mana',
    
    /** 攻击力：增加物理伤害输出 */
    AttackDamage = 'attackDamage',
    
    /** 法术强度：增加技能伤害输出 */
    AbilityPower = 'abilityPower',
    
    /** 护甲：减少受到的物理伤害 */
    Armor = 'armor',
    
    /** 魔法抗性：减少受到的魔法伤害 */
    MagicResist = 'magicResist',
    
    /** 攻击速度：决定角色攻击的速率 */
    AttackSpeed = 'attackSpeed',
    
    /** 暴击几率：角色攻击造成额外伤害的概率 */
    CriticalStrikeChance = 'criticalStrikeChance',
    
    // Other shared/common attributes
    /** 移动速度：决定角色移动的速度 */
    MovementSpeed = 'movementSpeed',
    
  }

enum AttributeDerivedStats {
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

// 使用枚举的示例：
let heroDerivedStat: AttributeDerivedStats = AttributeDerivedStats.ATTRIBUTE_STRENGTH_HP;








// "AttributePrimary"		"DOTA_ATTRIBUTE_AGILITY"
// "AttributeBaseStrength"		"19"
// "AttributeStrengthGain"		"2.300000"
// "AttributeBaseAgility"		"22"
// "AttributeAgilityGain"		"2.500000"
// "AttributeBaseIntelligence"		"18"
// "AttributeIntelligenceGain"		"2.000000"

// // Base Stats
// //-------------------------------------------------------------------------------------------------------------
// "ArmorPhysical"			"1"
// "MovementSpeed"			"295"

// // Attack
// //-------------------------------------------------------------------------------------------------------------
// "AttackCapabilities"		"DOTA_UNIT_CAP_RANGED_ATTACK"
// "AttackDamageMin"		"28"
// "AttackDamageMax"		"36"
// "AttackRate"		"1.800000"
// "AttackRange"		"500"

// "AttributePrimary" "DOTA_ATTRIBUTE_AGILITY"：表示该英雄的主要属性是敏捷(agility)。在类似DOTA的游戏中，主要属性对英雄的某些能力产生影响，比如每点敏捷能增加一定的攻击速度和护甲。
// "AttributeBaseStrength" "19"：表示英雄的基础力量(strength)值为19。力量通常影响英雄的生命值和生命恢复。
// "AttributeStrengthGain" "2.300000"：表示该英雄每升一级力量增加2.3点。
// "AttributeBaseAgility" "22"：表示该英雄的基础敏捷值为22。
// "AttributeAgilityGain" "2.500000"：表示该英雄每升一级敏捷增加2.5点。
// "AttributeBaseIntelligence" "18"：表示该英雄的基础智力(intelligence)值为18。智力影响英雄的魔法值和魔法恢复。
// "AttributeIntelligenceGain" "2.000000"：表示该英雄每升一级智力增加2.0点。
// 接下来是基础状态：
// "ArmorPhysical" "1"：表示该英雄的物理护甲为1，影响受到的物理伤害减免。
// "MovementSpeed" "295"：表示英雄的移动速度为295，影响在游戏世界中移动的速度。
// 最后是攻击属性：
// "AttackCapabilities" "DOTA_UNIT_CAP_RANGED_ATTACK"：表示该英雄是远程攻击单位。
// "AttackDamageMin" "28"：英雄的最小攻击伤害值为28。
// "AttackDamageMax" "36"：英雄的最大攻击伤害值为36。这表示每次攻击的伤害范围在28至36之间。
// "AttackRate" "1.800000"：表示英雄的基础攻击间隔为1.8秒。即每1.8秒可以发起一次攻击。
// "AttackRange" "500"：表示英雄攻击的射程距离为500。对于远程攻击来说，这个数值表示英雄在不移动的情况下能攻击到多远的目标。