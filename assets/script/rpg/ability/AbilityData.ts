
// AbilitySpecial 通常用于定义一些变量数值，这些数值往往关联到技能的等级。例如，技能冷却时间、伤害、范围等在每个技能等级都可能有不同的设置。这就是为什么 AbilitySpecial 中常常会看到一些范围，比如 "110 140 170 200"，这表示在每个等级，该值会分别是 110, 140, 170, 200。
// AbilityValues 则是用来提供一些对技能描述更为固定的属性信息，它的值通常不会因为技能等级的改变而改变。比如技能持续时间 (duration)、技能效果范围 (radius) 等等。

import { DamageType } from "../enum/Damage";
import { AbilityBehavior, AbilityType,  } from "../enum/Type";
import { UnitTargetFlag, UnitTargetTeam, UnitTargetType } from "../enum/Unit";
import { DataReader } from "./DataReader";




export class AbilityData extends DataReader{
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
    private spellDispellableType: number;
    private spellImmunityType: number;
    private abilityCastRange: number;

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
    protected projectileSpeed: number;
    protected projectileDistance: number;


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
        this.spellDispellableType = data.SpellDispellableType;
        this.spellImmunityType = data.SpellImmunityType;
        this.abilityCastRange = data.AbilityCastRange;

        this.abilityCooldown = this.parseNumberArray(data.AbilityCooldown);
        this.abilityManaCost = this.parseNumberArray(data.AbilityManaCost);
        this.abilityDuration = this.parseNumberArray(data.AbilityDuration);
        this.abilityDamage = this.parseNumberArray(data.AbilityDamage);

        this.precache = data.precache;
        this.abilityValues = new AbilityValues(data.AbilityValues);
        this.abilitySpecials = this.parseAbilitySpecials(data.AbilitySpecial);

        this.abilityCastPoint = this.parseNumberArray(data.AbilityCastPoint);
        this.abilityChannelTime = this.parseNumberArray(data.AbilityChannelTime);

        // 投射物相关属性
        this.projectileSpeed = data.ProjectileSpeed || 0;
        this.projectileDistance = data.ProjectileDistance || 0;
    }

  

    private parseNumberArray(value: string): number[] {
        return value?.split(' ').map(Number) || [];
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

    public GetAbilityType(): AbilityType {
        return this.abilityType;
    }

    public GetAbilityDamageType(): DamageType {
        return this.abilityUnitDamageType;
    }

    public GetAbilityTargetFlags(): UnitTargetFlag {
        return this.abilityUnitTargetFlag;
    }

    public GetAbilityTargetTeam(): UnitTargetTeam {
        return this.abilityUnitTargetTeam;
    }

    public GetAbilityTargetType(): UnitTargetType {
        return this.abilityUnitTargetType;
    }

    public GetBehavior(): AbilityBehavior {
        return this.abilityBehavior;
    }

    public GetMaxLevel(): number {
        return this.maxLevel;
    }

    public GetCastRange(): number {
        return this.abilityCastRange;
    }

    public GetCooldown(level: number = 1): number {
        return this.abilityCooldown[Math.min(level, this.abilityCooldown.length) - 1] ?? 0;
    }

    public GetManaCost(level: number = 1): number {
        return this.abilityManaCost[Math.min(level, this.abilityManaCost.length) - 1] ?? 0;
    }

  
    public GetLevelSpecialValueFor(name: string, level: number): number {
        const special = this.abilitySpecials[name];
        if (!special) throw new Error(`No such property name: ${name}`);
        return this.getValueForLevel(special.propertyValues, level);
    }

    public GetCastPoint(level: number = 1): number {
        return this.abilityCastPoint[Math.min(level, this.abilityCastPoint.length) - 1] ?? 0;
    }

    public GetChannelTime(level: number = 1): number {
        return this.abilityChannelTime[Math.min(level, this.abilityChannelTime.length) - 1] ?? 0;
    }


    public GetProjectileSpeed(): number {
        return this.projectileSpeed;
    }

    public GetProjectileDistance(): number {
        return this.projectileDistance;
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