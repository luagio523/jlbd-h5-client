
// AbilitySpecial 通常用于定义一些变量数值，这些数值往往关联到技能的等级。例如，技能冷却时间、伤害、范围等在每个技能等级都可能有不同的设置。这就是为什么 AbilitySpecial 中常常会看到一些范围，比如 "110 140 170 200"，这表示在每个等级，该值会分别是 110, 140, 170, 200。
// AbilityValues 则是用来提供一些对技能描述更为固定的属性信息，它的值通常不会因为技能等级的改变而改变。比如技能持续时间 (duration)、技能效果范围 (radius) 等等。

import { AbilityBehavior, AbilityType, DamageType } from "../type/Type";
import { UnitTargetFlags, UnitTargetTeam, UnitTargetType } from "../type/Unit";

export class AbilityData {
    // 基础属性
    protected baseClass: string; //基类BaseAbility
    protected scriptFile: string;  //对应的技能实现类
    protected abilityTextureName: string; //显示的图标纹理

    protected maxLevel:number //最大等级
    protected abilityType: AbilityType; //技能类型 看定义
    protected abilityUnitDamageType:DamageType; //伤害类型
    // 技能行为
    protected abilityBehavior: AbilityBehavior; //技能行为 具体看定义
    protected abilityUnitTargetTeam: UnitTargetTeam; //目标组
    protected abilityUnitTargetType: UnitTargetType; //目标类型
    protected abilityUnitTargetFlags: UnitTargetFlags; //目标特殊标记

    protected spellDispellableType:number //驱散类型
    protected spellImmunityType:number //免疫类型

    protected abilityCastRange:number //施法距离

    // 技能数值
    protected abilityCooldown: Array<number>; //冷却
    protected abilityManaCost: Array<number>; //魔法消耗
    protected abilityDuration: Array<number>; //施法间隔
    protected abilityDamage: Array<number>; //伤害
     // 特殊效果
    protected abilitySpecials:{[specialKey:string]:AbilitySpecial}
    
    protected precache:{[key:string]:string} //预加载

    protected abilityValues:AbilityValues 

    
    public GetAbilityType(): AbilityType{
        return this.abilityType
    }

    public GetAbilityDamageType(): DamageType{
        return this.abilityUnitDamageType
    }

    public GetAbilityTargetFlags(): UnitTargetFlags{
        return this.abilityUnitTargetFlags
    }

    public GetAbilityTargetTeam(): UnitTargetTeam{
        return this.abilityUnitTargetTeam
    }

    public GetAbilityTargetType(): UnitTargetType{
        return this.abilityUnitTargetType
    }
    public GetBehavior(): AbilityBehavior{
        return this.abilityBehavior
    }
 
    public GetMaxLevel(): number{
        return this.maxLevel || 100
    }

    public GetCastRange(): number{
        return this.abilityCastRange
    }


    public GetCooldown(level: number): number{
        if(level < 1) throw new Error("Level must be equal or greater than 1.");
        level = Math.min(level, this.abilityCooldown.length);
        return this.abilityCooldown[level - 1];
    }
    
    public GetManaCost(level: number): number{
        if(level < 1) throw new Error("Level must be equal or greater than 1.");
        level = Math.min(level, this.abilityManaCost.length);
        return this.abilityManaCost[level - 1];
    }
    
    public GetLevelSpecialValueFor(name: string, level: number): number{
        if(level < 1) throw new Error("Level must be equal or greater than 1.");
        let propertyValues =  this.abilitySpecials[name]?.propertyValues;
        if(!propertyValues) throw new Error("No such property name.");
        level = Math.min(level, propertyValues.length);
        return propertyValues[level - 1];
    }

    // GetChannelledHealthCostPerSecond(level: number): number;
    // GetChannelledManaCostPerSecond(level: number): number;
    // GetChannelStartTime(): number;
    // GetChannelTime(): number;


    constructor(data: any) {
        this.baseClass = data.BaseClass;
        this.scriptFile = data.ScriptFile;
        this.abilityTextureName = data.AbilityTextureName;
        this.abilityType = this.parseAbilityType(data.abilityType)
        this.abilityUnitDamageType  = this.parseAbilityUnitDamageType(data.AbilityUnitDamageType)
        this.abilityBehavior = this.parseAbilityBehavior(data.AbilityBehavior);
        this.abilityUnitTargetTeam = this.parseAbilityUnitTargetTeam(data.AbilityUnitTargetTeam);
        this.abilityUnitTargetType =  this.parseAbilityUnitTargetType(data.AbilityUnitTargetType);
        this.abilityUnitTargetFlags =  this.parseAbilityUnitTargetFlags(data.abilityUnitTargetFlags);

        this.abilityCooldown = data.abilityCooldown.split(' ').map((cooldown: string) => parseInt(cooldown));
        this.abilityManaCost = data.AbilityManaCost.split(' ').map((cost: string) => parseInt(cost));
        this.abilityDuration = data.AbilityManaCost.split(' ').map((duration: string) => parseInt(duration));
        this.abilityDamage = data.AbilityDamage.split(' ').map((damage: string) => parseInt(damage));

        this.precache = data.precache

        this.abilityValues = new AbilityValues(data.abilityValues)

        this.abilitySpecials = {}
        // 遍历AbilitySpecial并填充abilitySpecial数组
        for (const key in data.AbilitySpecial) {
            if (data.AbilitySpecial.hasOwnProperty(key)) {
                const specialData = data.AbilitySpecial[key];
                const varType = specialData.var_type;
                delete specialData.var_type; // 删除 var_type 属性，它已经被单独处理了
                const abilitySpecial = new AbilitySpecial(varType, specialData);
                this.abilitySpecials[abilitySpecial.propertyKey] = abilitySpecial;
            }
        }
    }

    protected parseAbilityType(typeString: string): number {
        let typeValue = 0;
        let types = typeString.split(' | ');
        for (let i = 0; i < types.length; i++) {
            typeValue |= AbilityType[types[i]] || 0; // 使用枚举获取行为对应的数值
        }
        return typeValue;
    }

    protected parseAbilityUnitDamageType(unitDamageTypeString: string): number {
        let unitDamageTypeValue = 0;
        let unitDamageTypes = unitDamageTypeString.split(' | ');
        for (let i = 0; i < unitDamageTypes.length; i++) {
          unitDamageTypeValue |= DamageType[unitDamageTypes[i]] || 0; // 使用枚举获取行为对应的数值
        }
        return unitDamageTypeValue;
    }

    protected parseAbilityBehavior(behaviorString: string): number {
        let behaviorValue = 0;
        let behaviors = behaviorString.split(' | ');
        for (let i = 0; i < behaviors.length; i++) {
          behaviorValue |= AbilityBehavior[behaviors[i]] || 0; // 使用枚举获取行为对应的数值
        }
        return behaviorValue;
    }

    protected parseAbilityUnitTargetTeam(unitTargetTeamString: string): number {
        let unitTargetTeamValue = 0;
        let unitTargetTeams = unitTargetTeamString.split(' | ');
        for (let i = 0; i < unitTargetTeams.length; i++) {
            unitTargetTeamValue |= UnitTargetTeam[unitTargetTeams[i]] || 0; // 使用枚举获取行为对应的数值
        }
        return unitTargetTeamValue;
    }

    protected parseAbilityUnitTargetType(unitTargetTypeString: string): number {
        let unitTargetTypeValue = 0;
        let unitTargetTypes = unitTargetTypeString.split(' | ');
        for (let i = 0; i < unitTargetTypes.length; i++) {
            unitTargetTypeValue |= UnitTargetType[unitTargetTypes[i]] || 0; // 使用枚举获取行为对应的数值
        }
        return unitTargetTypeValue;
    }

    protected parseAbilityUnitTargetFlags(unitTargetFlagsString: string): number {
        let unitTargetFlagsValue = 0;
        let unitTargetFlagss = unitTargetFlagsString.split(' | ');
        for (let i = 0; i < unitTargetFlagss.length; i++) {
            unitTargetFlagsValue |= UnitTargetFlags[unitTargetFlagss[i]] || 0; // 使用枚举获取行为对应的数值
        }
        return unitTargetFlagsValue;
    }

}

// AbilitySpecial类表示技能的特殊效果部分
class AbilitySpecial {
    varType: VarType;
    properties: {[key: string]: number[]};
    propertyKey:string;
    propertyValues:Array<number>

    constructor(varType: VarType, properties: {[key: string]: string}) {
        this.varType = varType;
        this.properties = {};
        
        for (let key in properties) { //只接受一个key
            if(key != "var_type"){
                this.propertyKey = key
                this.propertyValues = properties[key].split(' ').map(Number);

                switch (varType) {
                    case "FIELD_FLOAT":
                        this.propertyValues = properties[key].split(' ').map((v: string) => parseFloat(v));
                        break;
                    case "FIELD_INTEGER":
                        this.propertyValues = properties[key].split(' ').map((v: string) => parseInt(v));
                        break;
                    // 处理其他可能的var_type
                }
                break  //只接受一个key
            }
        }
    }
}



class AbilityValues {
    properties: {[key: string]: any};

    constructor(properties: {[key: string]: string}) {
        this.properties = properties
    }
}


const enum VarType {
    FIELD_FLOAT = "FIELD_FLOAT",
    FIELD_INTEGER = "FIELD_INTEGER"
}
