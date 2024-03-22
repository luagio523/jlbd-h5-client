import { ECSEntity } from "../ecs/ECSEntity"

export class Item {
    public id:string 
    public name:string 
    public itemType:ItemType 
    public description:string


    
}





export enum ItemType {
    ITEM_TYPE_EQUIPMENT = 1,
    ITEM_TYPE_COMSUMABLE = 2,
    ITEM_TYPE_MATERIAL = 3,
}






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