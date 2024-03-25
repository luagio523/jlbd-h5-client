
// "npc_dota_hero_juggernaut" // 剑圣的内部名称
// {
//     // 英雄基本属性配置
//     "AttackCapability" "DOTA_UNIT_CAP_MELEE_ATTACK"
//     "AttackDamageMin" "20"            // 攻击力最小值
//     "AttackDamageMax" "25"            // 攻击力最大值
//     "AttackRate" "1.7"                // 攻击速度
//     "AttackAnimationPoint" "0.33"     // 攻击动画触发点，从0开始计算至此
//     "AttackAcquisitionRange" "600"    // 攻击寻敌范围
//     "AttackRange" "128"               // 攻击距离，近战通常是小于等于150
//     // 其他属性...
// }


// "DOTAHeroes"
// {
// 	//=================================================================================================================
// 	// HERO: Sally
// 	//=================================================================================================================
// 	"npc_dota_hero_megumin"
// 	{
// 		// "override_hero"					"npc_dota_hero_marci"	// Hero to override
// 		"BaseClass"					"npc_dota_hero_lina"
// 		"HeroID"					"204"

// 		// Models
// 		//----------------------------------------------------------------
// 		// need custom model
// 		"Model"					"models/heroes/lina/lina.vmdl"
// 		"ModelScale"			"1"
// 		"SoundSet"				"Hero_Lina"
// 		"particle_folder"		"particles/units/heroes/hero_lina"
// 		"GameSoundsFile"		"soundevents/game_sounds_heroes/game_sounds_lina.vsndevts"
// 		"VoiceFile"				"soundevents/voscripts/game_sounds_vo_lina.vsndevts"

// 		// Abilities
// 		//----------------------------------------------------------------
// 		"Ability1"						"megumin_crimson_core"
// 		"Ability2"						"megumin_emerald_core"
// 		"Ability3"						"megumin_azure_core"
// 		"Ability4"						"megumin_golden_core"
// 		"Ability5"						"generic_hidden"
// 		"Ability6"						"megumin_explosion"
// 		"Ability10"						"special_bonus_hp_300"
// 		"Ability11"						"special_bonus_attack_base_damage_40"
// 		"Ability12"						"special_bonus_armor_15"
// 		"Ability13"						"special_bonus_attack_speed_50"
// 		"Ability14"						"special_bonus_spell_lifesteal_25"
// 		"Ability15"						"special_bonus_all_stats_15"
// 		"Ability16"						"special_bonus_haste"
// 		"Ability17"						"special_bonus_spell_immunity"

// 		// Armor
// 		//----------------------------------------------------------------
// 		"ArmorPhysical"				    "0"		// Physical protection.
// 		"MagicalResistance"				"25"	// Magical protection.

// 		// Attack
// 		//----------------------------------------------------------------
// 		"AttackCapabilities"		"DOTA_UNIT_CAP_RANGED_ATTACK"
// 		"AttackDamageMin"			"12"
// 		"AttackDamageMax"			"18"
// 		"AttackDamageType"			"DAMAGE_TYPE_ArmorPhysical"
// 		"AttackRate"				"1.7"
// 		"AttackAnimationPoint"		"0.3"
// 		"AttackRange"				"600"
// 		"AttackAcquisitionRange"	"800"
// 		"ProjectileSpeed"			"1000"
// 		"ProjectileModel"			"particles/units/heroes/hero_lina/lina_base_attack.vpcf"

// 		// Attributes
// 		//----------------------------------------------------------------
// 		"AttributePrimary"			"DOTA_ATTRIBUTE_INTELLECT"
// 		"AttributeBaseStrength"		"16"
// 		"AttributeStrengthGain"		"1.5"
// 		"AttributeBaseIntelligence"	"32"
// 		"AttributeIntelligenceGain"	"4.3"
// 		"AttributeBaseAgility"		"20"
// 		"AttributeAgilityGain"		"2.2"

// 		// Bounds
// 		//----------------------------------------------------------------
// 		"BoundsHullName"			"DOTA_HULL_SIZE_HERO"

// 		// Movement
// 		//----------------------------------------------------------------
// 		"MovementCapabilities"		"DOTA_UNIT_CAP_MOVE_GROUND"
// 		"MovementSpeed"				"300"
// 		"MovementTurnRate"			"0.6"

// 		// Team
// 		//----------------------------------------------------------------
// 		"TeamName"					"DOTA_TEAM_GOODGUYS"
// 		"CombatClassAttack"			"DOTA_COMBAT_CLASS_ATTACK_HERO"
// 		"CombatClassDefend"			"DOTA_COMBAT_CLASS_DEFEND_HERO"
// 		"UnitRelationshipClass"		"DOTA_NPC_UNIT_RELATIONSHIP_TYPE_HERO"
		
// 		// Vision
// 		//----------------------------------------------------------------
// 		"VisionDaytimeRange"		"1800"
// 		"VisionNighttimeRange"		"800"
// 	}
// }


// "npc_dota_hero_juggernaut_custom" // 假设剑圣的内部名为npc_dota_hero_juggernaut_custom
// {
//     // ...英雄的其他属性...
    
//     "AttackCapabilities"            "DOTA_UNIT_CAP_MELEE_ATTACK" // 定义剑圣为近战单位
//     "AttackEffectName"              "particles/your_custom_folder/juggernaut_sword_effect.pcf" // 剑击特效粒子文件的路径
//     "AttackEffectAttachType"        "follow_weapon" // 特效附着类型，例如跟随武器
//     "AttackAnimationPoint"          "0.33" // 攻击动作点，调整这可以改变攻击动画的流畅度和攻击时机
    
//     // ...英雄的其他属性...
// }


class HeroData {
    BaseClass: string;
    HeroID: number;
    Model: string;
    ModelScale: string;
    SoundSet: string;
    Ability1: string;
    ArmorPhysical: string;
    MagicalResistance: string;
    AttackCapabilities: string;
    AttackDamageMin: number;
    AttackDamageMax: number;
    AttackDamageType: string;
    AttackRate: number;
    AttackAnimationPoint: number;
    AttackAcquisitionRange:number;//攻击获取距离
    AttackRange: number;
    AttributePrimary: string;
    AttributeBaseStrength: number;
    AttributeStrengthGain: number;
    AttributeBaseIntelligence: number;
    AttributeIntelligenceGain: number;
    AttributeBaseAgility: number;
    AttributeAgilityGain: number;
    MovementCapabilities: string;
    MovementSpeed: string;
    MovementTurnRate: string;
    TeamName: string;
    VisionDaytimeRange: number;
    VisionNighttimeRange: number;

    constructor(heroData: any) {
        this.BaseClass = heroData["BaseClass"];
        this.HeroID = heroData["HeroID"];
        this.Model = heroData["Model"];
        this.ModelScale = heroData["ModelScale"];
        this.SoundSet = heroData["SoundSet"];
        this.Ability1 = heroData["Ability1"];
        this.ArmorPhysical = heroData["ArmorPhysical"];
        this.MagicalResistance = heroData["MagicalResistance"];
        this.AttackCapabilities = heroData["AttackCapabilities"];
        this.AttackDamageMin = heroData["AttackDamageMin"];
        this.AttackDamageMax = heroData["AttackDamageMax"];
        this.AttackDamageType = heroData["AttackDamageType"];
        this.AttackRate = heroData["AttackRate"];
        this.AttackAnimationPoint = heroData["AttackAnimationPoint"];
        this.AttackRange = heroData["AttackRange"];
        this.AttributePrimary = heroData["AttributePrimary"];
        this.AttributeBaseStrength = heroData["AttributeBaseStrength"];
        this.AttributeStrengthGain = heroData["AttributeStrengthGain"];
        this.AttributeBaseIntelligence = heroData["AttributeBaseIntelligence"];
        this.AttributeIntelligenceGain = heroData["AttributeIntelligenceGain"];
        this.AttributeBaseAgility = heroData["AttributeBaseAgility"];
        this.AttributeAgilityGain = heroData["AttributeAgilityGain"];
        this.MovementCapabilities = heroData["MovementCapabilities"];
        this.MovementSpeed = heroData["MovementSpeed"];
        this.MovementTurnRate = heroData["MovementTurnRate"];
        this.TeamName = heroData["TeamName"];
        this.VisionDaytimeRange = heroData["VisionDaytimeRange"];
        this.VisionNighttimeRange = heroData["VisionNighttimeRange"];
    }
}