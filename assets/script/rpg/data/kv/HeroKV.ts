import { KVReader } from "./KVReader";
import { DamageType } from "../../enum/Damage";
import { AttackType, Attributes } from "../../enum/Type";

export class HeroKV extends KVReader {
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

    protected attackDamageType: DamageType;
    protected attackRate: number;
    protected attackRange: number;

    // 新增的攻击相关属性
    protected attackAnimationPoint: number;
    protected attackAcquisitionRange: number;
    protected attackType: AttackType;

    // 新增的属性
    protected movementTurnRate: number; // Movement turn rate
    protected visionDaytimeRange: number; // Vision range during the day
    protected visionNighttimeRange: number; // Vision range during the night

    // 模型和声音相关属性
    protected model: string; // Model path
    protected modelName: string; // Model path
    protected gender: number; // Gender
    protected modelType: string; // Model type
    protected modelScale: number; // Model scale
    protected frameRate: number; // Frame rate
    protected soundSet: string; // Sound set
    protected particleFolder: string; // Particle folder
    protected gameSoundsFile: string; // Game sounds file
    protected voiceFile: string; // Voice file

    // 额外的属性
    protected boundsHullName: string; // Bounds hull name
    protected teamName: string; // Team name
    protected combatClassAttack: string; // Combat class attack
    protected combatClassDefend: string; // Combat class defend
    protected unitRelationshipClass: string; // Unit relationship class

    // 技能和天赋
    protected abilities: string[];
    protected talents: string[];

    public deserialize(data: any): void {
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

        this.magicalResistance = parseFloat(data.MagicalResistance);

        this.baseHealth = parseFloat(data.StatusHealth);
        this.baseMana = parseFloat(data.StatusMana);
        this.baseArmor = parseFloat(data.ArmorPhysical);
        this.baseMoveSpeed = parseFloat(data.MovementSpeed);
        this.attackDamageMin = parseFloat(data.AttackDamageMin);
        this.attackDamageMax = parseFloat(data.AttackDamageMax);
        this.attackDamageType = this.parseEnumValue(DamageType, data.AttackDamageType);

        this.attackRate = parseFloat(data.AttackRate);
        this.attackRange = parseFloat(data.AttackRange);

        this.attackAnimationPoint = parseFloat(data.AttackAnimationPoint);
        this.attackAcquisitionRange = parseFloat(data.AttackAcquisitionRange);
        this.attackType = this.parseEnumValue(AttackType, data.AttackType);

        // 新增的属性
        this.movementTurnRate = parseFloat(data.MovementTurnRate);
        this.visionDaytimeRange = parseFloat(data.VisionDaytimeRange);
        this.visionNighttimeRange = parseFloat(data.VisionNighttimeRange);

        // 模型和声音相关属性
        this.model = data.Model; // Model path
        this.modelType = data.ModelType; // Model type
        this.modelScale = parseFloat(data.ModelScale); // Model scale
        this.gender = parseFloat(data.Gender); // Gender
        this.frameRate = parseFloat(data.FrameRate)||12; // Frame rate
        this.soundSet = data.SoundSet; // Sound set
        this.particleFolder = data.particle_folder; // Particle folder
        this.gameSoundsFile = data.GameSoundsFile; // Game sounds file
        this.voiceFile = data.VoiceFile; // Voice file

        // 额外的属性
        this.boundsHullName = data.BoundsHullName; // Bounds hull name
        this.teamName = data.TeamName; // Team name
        this.combatClassAttack = data.CombatClassAttack; // Combat class attack
        this.combatClassDefend = data.CombatClassDefend; // Combat class defend
        this.unitRelationshipClass = data.UnitRelationshipClass; // Unit relationship class

        // 技能和天赋
        this.abilities = [
            data.Ability1,
            data.Ability2,
            data.Ability3,
            data.Ability4,
            data.Ability5,
            data.Ability6,
            data.Ability10,
            data.Ability11,
            data.Ability12,
            data.Ability13,
            data.Ability14,
            data.Ability15,
            data.Ability16,
            data.Ability17
        ].filter(Boolean); // Filter out any undefined abilities

        this.talents = [
            data.Talent1,
            data.Talent2,
            data.Talent3,
            data.Talent4,
            data.Talent5,
            data.Talent6,
            data.Talent7,
            data.Talent8
        ].filter(Boolean); // Filter out any undefined talents
    }

    // Getter methods
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

    public GetAttackDamageType(): DamageType {
        return this.attackDamageType;
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
        return this.magicalResistance;   
    }

    // 新增的 getter 方法
    public GetMovementTurnRate(): number {
        return this.movementTurnRate;
    }

    public GetVisionDaytimeRange(): number {
        return this.visionDaytimeRange;
    }

    public GetVisionNighttimeRange(): number {
        return this.visionNighttimeRange;
    }

    // 模型和声音相关的 getter 方法
    public GetModel(): string {
        return this.model;
    }

    public GetModelType(): string {
        return this.modelType;
    }

    public GetModelScale(): number {
        return this.modelScale;
    }

    public GetFrameRate(): number {
        return this.frameRate;
    }

    public GetGender(): number {
        return this.gender;
    }

    public GetSoundSet(): string {
        return this.soundSet;
    }

    public GetParticleFolder(): string {
        return this.particleFolder;
    }

    public GetGameSoundsFile(): string {
        return this.gameSoundsFile;
    }

    public GetVoiceFile(): string {
        return this.voiceFile;
    }

    // 额外的 getter 方法
    public GetBoundsHullName(): string {
        return this.boundsHullName;
    }

    public GetTeamName(): string {
        return this.teamName;
    }

    public GetCombatClassAttack(): string {
        return this.combatClassAttack;
    }

    public GetCombatClassDefend(): string {
        return this.combatClassDefend;
    }

    public GetUnitRelationshipClass(): string {
        return this.unitRelationshipClass;
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