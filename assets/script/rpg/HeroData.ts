
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