import { DataReader } from "../ability/DataReader";
import { DamageType } from "../enum/Damage";
import { AttackType, Attributes } from "../enum/Type";

export class HeroData extends DataReader{
    // 基础属性
    protected heroName: string;
    protected heroId: number;
    protected team: string;
    protected primaryAttribute: Attributes;

    // 属性成长
    protected baseStrength: number;
    protected baseAgility: number;
    protected baseIntelligence: number;
    protected strengthGain: number;
    protected agilityGain: number;
    protected intelligenceGain: number;

    protected magicalResistance: number;

    // 战斗属性
    protected baseHealth: number;
    protected baseMana: number;
    protected baseArmor: number;
    protected baseMoveSpeed: number;
    protected attackDamageMin: number;
    protected attackDamageMax: number;

    protected attackDamageType:DamageType
    protected attackRate: number;
    protected attackRange: number;

     // 新增的攻击相关属性
     protected attackAnimationPoint: number;
     protected attackAcquisitionRange: number;
     protected attackType: AttackType;

    // 技能和天赋
    protected abilities: string[];
    protected talents: string[];


    protected parseJsonData(data: any): void {
        this.heroName = data.HeroName;
        this.heroId = data.HeroID;
        this.team = data.Team;
        this.primaryAttribute = this.parseEnumValue(Attributes, data.AttributePrimary);

        this.baseStrength = parseFloat(data.AttributeBaseStrength);
        this.baseAgility = parseFloat(data.AttributeBaseAgility);
        this.baseIntelligence = parseFloat(data.AttributeBaseIntelligence);
        this.strengthGain = parseFloat(data.AttributeStrengthGain);
        this.agilityGain = parseFloat(data.AttributeAgilityGain);
        this.intelligenceGain = parseFloat(data.AttributeIntelligenceGain);

        this.magicalResistance = parseFloat(data.AttributeMagicResistance) || 25;

        this.baseHealth = parseFloat(data.StatusHealth);
        this.baseMana = parseFloat(data.StatusMana);
        this.baseArmor = parseFloat(data.ArmorPhysical);
        this.baseMoveSpeed = parseFloat(data.MovementSpeed);
        this.attackDamageMin = parseFloat(data.AttackDamageMin);
        this.attackDamageMax = parseFloat(data.AttackDamageMax);
        this.attackRate = parseFloat(data.AttackRate);
        this.attackRange = parseFloat(data.AttackRange);


        this.attackAnimationPoint = parseFloat(data.AttackAnimationPoint);
        this.attackAcquisitionRange = parseFloat(data.AttackAcquisitionRange);
        this.attackType = this.parseEnumValue(AttackType, data.AttackType);

        this.abilities = data.Ability1 ? [data.Ability1, data.Ability2, data.Ability3, data.Ability4] : [];
        this.talents = data.Talent1 ? [data.Talent1, data.Talent2, data.Talent3, data.Talent4, data.Talent5, data.Talent6, data.Talent7, data.Talent8] : [];
    }

    

    public GetHeroName(): string {
        return this.heroName;
    }

    public GetHeroId(): number {
        return this.heroId;
    }

    public GetTeam(): string {
        return this.team;
    }

    public GetPrimaryAttribute(): Attributes {
        return this.primaryAttribute;
    }

    public GetBaseStrength(): number {
        return this.baseStrength;
    }

    public GetBaseAgility(): number {
        return this.baseAgility;
    }

    public GetBaseIntelligence(): number {
        return this.baseIntelligence;
    }

    public GetStrengthGain(): number {
        return this.strengthGain;
    }

    public GetAgilityGain(): number {
        return this.agilityGain;
    }

    public GetIntelligenceGain(): number {
        return this.intelligenceGain;
    }

    public GetBaseHealth(): number {
        return this.baseHealth;
    }

    public GetBaseMana(): number {
        return this.baseMana;
    }

    public GetBaseArmor(): number {
        return this.baseArmor;
    }

    public GetBaseMoveSpeed(): number {
        return this.baseMoveSpeed;
    }

    public GetAttackDamage(): [number, number] {
        return [this.attackDamageMin, this.attackDamageMax];
    }

    public GetAttackRate(): number {
        return this.attackRate;
    }

    public GetAttackRange(): number {
        return this.attackRange;
    }

    public GetAbilities(): string[] {
        return this.abilities;
    }

    public GetTalents(): string[] {
        return this.talents;
    }

    public GetAttackAnimationPoint(): number {
        return this.attackAnimationPoint;
    }

    public GetAttackAcquisitionRange(): number {
        return this.attackAcquisitionRange;
    }

    public GetAttackType(): AttackType {
        return this.attackType;
    }

    public GetMagicResistance(): number {
        return this.magicalResistance ;   
    }
}





// const juggernautData = {
//     HeroName: "npc_dota_hero_juggernaut",
//     HeroID: 8,
//     Team: "Good",
//     AttributePrimary: "DOTA_ATTRIBUTE_AGILITY",
//     AttributeBaseStrength: "20",
//     AttributeBaseAgility: "34",
//     AttributeBaseIntelligence: "14",
//     AttributeStrengthGain: "2.2",
//     AttributeAgilityGain: "2.8",
//     AttributeIntelligenceGain: "1.4",
//     StatusHealth: "200",
//     StatusMana: "75",
//     ArmorPhysical: "2",
//     MovementSpeed: "300",
//     AttackDamageMin: "24",
//     AttackDamageMax: "28",
//     AttackRate: "1.4",
//     AttackRange: "150",
//     Ability1: "juggernaut_blade_fury",
//     Ability2: "juggernaut_healing_ward",
//     Ability3: "juggernaut_blade_dance",
//     Ability4: "juggernaut_omni_slash",
//     // ... 天赋数据
// };

// const juggernaut = new HeroData(juggernautData);
// console.log(juggernaut.GetHeroName()); // "npc_dota_hero_juggernaut"
// console.log(juggernaut.GetPrimaryAttribute()); // AttributeType.AGILITY
// console.log(juggernaut.GetBaseAgility()); // 34
// console.log(juggernaut.GetAbilities()); // ["juggernaut_blade_fury", "juggernaut_healing_ward", "juggernaut_blade_dance", "juggernaut_omni_slash"]