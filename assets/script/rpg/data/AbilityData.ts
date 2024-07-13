
// AbilitySpecial 通常用于定义一些变量数值，这些数值往往关联到技能的等级。例如，技能冷却时间、伤害、范围等在每个技能等级都可能有不同的设置。这就是为什么 AbilitySpecial 中常常会看到一些范围，比如 "110 140 170 200"，这表示在每个等级，该值会分别是 110, 140, 170, 200。
// AbilityValues 则是用来提供一些对技能描述更为固定的属性信息，它的值通常不会因为技能等级的改变而改变。比如技能持续时间 (duration)、技能效果范围 (radius) 等等。

import { DataReader } from "../ability/DataReader";
import { DamageType } from "../enum/Damage";
import { AbilityBehavior, AbilityType,  } from "../enum/Type";
import { UnitTargetFlag, UnitTargetTeam, UnitTargetType } from "../enum/Unit";




export class AbilityData extends DataReader {
    // 基础属性
    private baseClass: string;
    private scriptFile: string;
    private abilityTextureName: string;
    private maxLevel: number;
    private abilityType: AbilityType;
    private abilityUnitDamageType: DamageType;

    // 技能行为
    private abilityBehavior: AbilityBehavior;
    private abilityUnitTargetTeam: UnitTargetTeam;
    private abilityUnitTargetType: UnitTargetType;
    private abilityUnitTargetFlag: UnitTargetFlag;
    private spellDispellableType: SpellDispellableType;
    private spellImmunityType: SpellImmunityType;
    private abilityCastRange: number | number[];

    // 技能数值
    private abilityCooldown: number[];
    private abilityManaCost: number[];
    private abilityDuration: number[];
    private abilityDamage: number[];
    private abilityCastPoint: number[];
    private abilityChannelTime: number[];

    // 特殊效果
    private abilitySpecials: { [specialKey: string]: AbilitySpecial };
    private precache: { [key: string]: string };
    private abilityValues: AbilityValues;

    // 投射物相关属性
    private projectileSpeed: number;
    private projectileDistance: number;

    // 新增属性
    private abilityFlags: AbilityFlag;
    private abilityDraftScepterUpgradeType: AbilityScepterUpgradeType;
    private abilityDraftShardUpgradeType: AbilityShardUpgradeType;
    private isGrantedByScepter: boolean;
    private isGrantedByShard: boolean;
    private hasScepterUpgrade: boolean;
    private hasShardUpgrade: boolean;
    private requiredLevel: number;
    private levelsBetweenUpgrades: number;
    private hotKeyOverride: string;

    protected parseJsonData(data: any): void {
        this.baseClass = data.BaseClass;
        this.scriptFile = data.ScriptFile;
        this.abilityTextureName = data.AbilityTextureName;
        this.maxLevel = data.MaxLevel || 1;
        this.abilityType = this.parseEnumValue(AbilityType, data.AbilityType);
        this.abilityUnitDamageType = this.parseEnumValue(DamageType, data.AbilityUnitDamageType);
        this.abilityBehavior = this.parseEnumValue(AbilityBehavior, data.AbilityBehavior);
        this.abilityUnitTargetTeam = this.parseEnumValue(UnitTargetTeam, data.AbilityUnitTargetTeam);
        this.abilityUnitTargetType = this.parseEnumValue(UnitTargetType, data.AbilityUnitTargetType);
        this.abilityUnitTargetFlag = this.parseEnumValue(UnitTargetFlag, data.AbilityUnitTargetFlag);
        this.spellDispellableType = this.parseEnumValue(SpellDispellableType, data.SpellDispellableType);
        this.spellImmunityType = this.parseEnumValue(SpellImmunityType, data.SpellImmunityType);
        this.abilityCastRange = this.parseNumberOrArray(data.AbilityCastRange);

        this.abilityCooldown = this.parseNumberArray(data.AbilityCooldown);
        this.abilityManaCost = this.parseNumberArray(data.AbilityManaCost);
        this.abilityDuration = this.parseNumberArray(data.AbilityDuration);
        this.abilityDamage = this.parseNumberArray(data.AbilityDamage);
        this.abilityCastPoint = this.parseNumberArray(data.AbilityCastPoint);
        this.abilityChannelTime = this.parseNumberArray(data.AbilityChannelTime);

        this.precache = data.precache;
        this.abilityValues = new AbilityValues(data.AbilityValues);
        this.abilitySpecials = this.parseAbilitySpecials(data.AbilitySpecial);

        this.projectileSpeed = data.ProjectileSpeed || 0;
        this.projectileDistance = data.ProjectileDistance || 0;

        this.abilityFlags = this.parseEnumValue(AbilityFlag, data.AbilityFlags);
        this.abilityDraftScepterUpgradeType = this.parseEnumValue(AbilityScepterUpgradeType, data.AbilityDraftScepterUpgradeType);
        this.abilityDraftShardUpgradeType = this.parseEnumValue(AbilityShardUpgradeType, data.AbilityDraftShardUpgradeType);
        this.isGrantedByScepter = data.IsGrantedByScepter === 1;
        this.isGrantedByShard = data.IsGrantedByShard === 1;
        this.hasScepterUpgrade = data.HasScepterUpgrade === 1;
        this.hasShardUpgrade = data.HasShardUpgrade === 1;
        this.requiredLevel = data.RequiredLevel || 1;
        this.levelsBetweenUpgrades = data.LevelsBetweenUpgrades || 2;
        this.hotKeyOverride = data.HotKeyOverride;
    }

    private parseNumberArray(value: string | number): number[] {
        if (typeof value === 'number') return [value];
        return value?.split(' ').map(Number) || [];
    }

    private parseNumberOrArray(value: string | number): number | number[] {
        if (typeof value === 'number') return value;
        const parsed = this.parseNumberArray(value);
        return parsed.length === 1 ? parsed[0] : parsed;
    }

    private parseAbilitySpecials(specials: any): { [key: string]: AbilitySpecial } {
        const result: { [key: string]: AbilitySpecial } = {};
        for (const key in specials) {
            const specialData = specials[key];
            const varType = specialData.var_type;
            delete specialData.var_type;
            const abilitySpecial = new AbilitySpecial(varType, specialData);
            result[abilitySpecial.propertyKey] = abilitySpecial;
        }
        return result;
    }

    public GetBaseClass(): string {
        return this.baseClass;
    }

    public GetScriptFile(): string {
        return this.scriptFile;
    }

    public GetAbilityTextureName(): string {
        return this.abilityTextureName;
    }

    public GetMaxLevel(): number {
        return this.maxLevel;
    }

    public GetAbilityType(): AbilityType {
        return this.abilityType;
    }

    public GetAbilityUnitDamageType(): DamageType {
        return this.abilityUnitDamageType;
    }

    public GetAbilityBehavior(): AbilityBehavior {
        return this.abilityBehavior;
    }

    public GetAbilityUnitTargetTeam(): UnitTargetTeam {
        return this.abilityUnitTargetTeam;
    }

    public GetAbilityUnitTargetType(): UnitTargetType {
        return this.abilityUnitTargetType;
    }

    public GetAbilityUnitTargetFlag(): UnitTargetFlag {
        return this.abilityUnitTargetFlag;
    }

    public GetSpellDispellableType(): SpellDispellableType {
        return this.spellDispellableType;
    }

    public GetSpellImmunityType(): SpellImmunityType {
        return this.spellImmunityType;
    }

    public GetCastRange(level: number = 1): number {
        if (Array.isArray(this.abilityCastRange)) {
            return this.abilityCastRange[Math.min(level, this.abilityCastRange.length) - 1] ?? 0;
        }
        return this.abilityCastRange ?? 0;
    }

    public GetCooldown(level: number = 1): number {
        return this.abilityCooldown[Math.min(level, this.abilityCooldown.length) - 1] ?? 0;
    }

    public GetManaCost(level: number = 1): number {
        return this.abilityManaCost[Math.min(level, this.abilityManaCost.length) - 1] ?? 0;
    }

    public GetAbilityDuration(level: number = 1): number {
        return this.abilityDuration[Math.min(level, this.abilityDuration.length) - 1] ?? 0;
    }

    public GetAbilityDamage(level: number = 1): number {
        return this.abilityDamage[Math.min(level, this.abilityDamage.length) - 1] ?? 0;
    }

    public GetCastPoint(level: number = 1): number {
        return this.abilityCastPoint[Math.min(level, this.abilityCastPoint.length) - 1] ?? 0;
    }

    public GetChannelTime(level: number = 1): number {
        return this.abilityChannelTime[Math.min(level, this.abilityChannelTime.length) - 1] ?? 0;
    }

    public GetAbilitySpecials(): { [specialKey: string]: AbilitySpecial } {
        return this.abilitySpecials;
    }

    public GetPrecache(): { [key: string]: string } {
        return this.precache;
    }

    public GetAbilityValues(): AbilityValues {
        return this.abilityValues;
    }

    public GetProjectileSpeed(): number {
        return this.projectileSpeed;
    }

    public GetProjectileDistance(): number {
        return this.projectileDistance;
    }

    public GetAbilityFlags(): AbilityFlag {
        return this.abilityFlags;
    }

    public GetAbilityDraftScepterUpgradeType(): AbilityScepterUpgradeType {
        return this.abilityDraftScepterUpgradeType;
    }

    public GetAbilityDraftShardUpgradeType(): AbilityShardUpgradeType {
        return this.abilityDraftShardUpgradeType;
    }

    public IsGrantedByScepter(): boolean {
        return this.isGrantedByScepter;
    }

    public IsGrantedByShard(): boolean {
        return this.isGrantedByShard;
    }

    public HasScepterUpgrade(): boolean {
        return this.hasScepterUpgrade;
    }

    public HasShardUpgrade(): boolean {
        return this.hasShardUpgrade;
    }

    public GetRequiredLevel(): number {
        return this.requiredLevel;
    }

    public GetLevelsBetweenUpgrades(): number {
        return this.levelsBetweenUpgrades;
    }

    public GetHotKeyOverride(): string {
        return this.hotKeyOverride;
    }

    public GetLevelSpecialValueFor(name: string, level: number): number {
        const special = this.abilitySpecials[name];
        if (!special) throw new Error(`No such property name: ${name}`);
        return this.getValueForLevel(special.propertyValues, level);
    }

    private getValueForLevel(values: number[], level: number): number {
        if (level < 1) throw new Error("Level must be equal or greater than 1.");
        level = Math.min(level, values.length);
        return values[level - 1];
    }
}
class AbilitySpecial {
    varType: VarType;
    propertyKey: string;
    propertyValues: number[];

    constructor(varType: VarType, properties: { [key: string]: string }) {
        this.varType = varType;
        [[this.propertyKey, this.propertyValues]] = Object.entries(properties).map(([key, value]) => [
            key,
            this.parsePropertyValues(value, varType)
        ]);
    }

    private parsePropertyValues(value: string, varType: VarType): number[] {
        const parser = varType === VarType.FIELD_FLOAT ? parseFloat : parseInt;
        return value.split(' ').map(parser);
    }
}

class AbilityValues {
    properties: { [key: string]: any };

    constructor(properties: { [key: string]: string }) {
        this.properties = properties;
    }
}

enum VarType {
    FIELD_FLOAT = "FIELD_FLOAT",
    FIELD_INTEGER = "FIELD_INTEGER"
    // ... other var types
}






enum AbilityFlag {
    ABILITY_FLAG_NONE = 0,
    ABILITY_FLAG_HIDDEN = 1,
    ABILITY_FLAG_RECOMMENDED = 2,
    ABILITY_FLAG_CASTABLE_WHILE_HIDDEN = 3,
    // ... 其他标志
}


enum AbilityScepterUpgradeType {
    ABILITY_SCEPTER_UPGRADE_TYPE_NONE = 0,
    ABILITY_SCEPTER_UPGRADE_TYPE_UPGRADE = 1,
    ABILITY_SCEPTER_UPGRADE_TYPE_NEW = 2
}

enum AbilityShardUpgradeType {
    ABILITY_SHARD_UPGRADE_TYPE_NONE = 0,
    ABILITY_SHARD_UPGRADE_TYPE_UPGRADE = 1,
    ABILITY_SHARD_UPGRADE_TYPE_NEW = 2
}


// 这个属性定义了技能对魔法免疫单位的影响。常见的值包括：
// SPELL_IMMUNITY_NONE - 技能完全不影响魔法免疫单位
// SPELL_IMMUNITY_ALLIES_YES - 技能可以影响魔法免疫的友方单位
// SPELL_IMMUNITY_ENEMIES_NO - 技能不能影响魔法免疫的敌方单位
export enum SpellImmunityType {
    SPELL_IMMUNITY_NONE = 0,
    SPELL_IMMUNITY_ALLIES_YES = 1,
    SPELL_IMMUNITY_ENEMIES_NO = 2,
    SPELL_IMMUNITY_ENEMIES_YES = 3,
    SPELL_IMMUNITY_ALLIES_NO = 4
}


// 这个属性定义了技能效果是否可以被驱散。常见的值包括：
// SPELL_DISPELLABLE_YES - 技能效果可以被普通驱散
// SPELL_DISPELLABLE_NO - 技能效果不能被驱散
// SPELL_DISPELLABLE_YES_STRONG - 技能效果只能被强驱散移除
export enum SpellDispellableType {
    SPELL_DISPELLABLE_NONE = 0,
    SPELL_DISPELLABLE_YES = 1,
    SPELL_DISPELLABLE_NO = 2,
    SPELL_DISPELLABLE_YES_STRONG = 3,
    SPELL_DISPELLABLE_INVULNERABLE = 4
}




