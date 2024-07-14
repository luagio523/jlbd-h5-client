import { Timer } from "../../core/common/timer/Timer";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierFunction } from "../enum/ModifierFunction";
import { ModifierAttribute } from "../enum/Modifier";
import { BaseAbility } from "./BaseAbility";
import { ModifierEvent } from "../enum/ModifierEvent";
import { ModifierState } from "../enum/ModifierState";
import { ModifierCategory } from "../enum/ModifierCategory";


// 例如，你可能想要把 value 当做基础的变化值，intensity 用来增强或者削弱这个基础效果。在这个框架里，
// 可以用 value来表示基础速度或者基础伤害，然后 intensity 用来影响这个基础速度或者基础伤害的强度。
// 对应到上述移动速度减缓的例子，可以将value用作基础减速值，
// 然后用intensity来增强这个减速效果。例如，如果value是10，intensity是0.2
// ，那么移动速度减缓为基础速度的10%，然后再额外减缓20%，即最终减缓比例为12%(=10% + 10%*0.2)。


// 有很多种实现强度增益的方式，但是具体的实现方式取决于你的设计需求。以下是一些常见的方式：
// **直接相加：**强度每次增加一个固定的值。比如初次Buff为10%移动速度，强度为1，下一次Buff叠加后，强度增加固定值1变为2，移动速度变为(1+1) * 10% = 20%。
// **百分比增加：**强度以固定的百分比增加。比如初次Buff为10%移动速度，强度为1，下一次Buff叠加后，强度以固定的百分比增加，比如10%，那么移动速度则变为 1.1*10%=11%。
// **指数增加：**强度以给定值的指数增加。例如，初次Buff为10%移动速度，强度为1，下次Buff叠加后，比如让强度的增长为指数增长，设强度立方（或者其他幂），则移动速度为1^310% = 10%，下一次为2^310% = 80%。



export class ModifierEventDispatcher {

    protected eventListeners: Map<ModifierEvent, Set<(event: ModifierEvent, params: any) => void>> = new Map();

    public addEventListener(eventType: ModifierEvent, listener: (event: ModifierEvent, params: any) => void): void {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, new Set());
        }
        this.eventListeners.get(eventType)!.add(listener);
    }

    public removeEventListener(eventType: ModifierEvent, listener: (event: ModifierEvent, params: any) => void): void {
        if (this.eventListeners.has(eventType)) {
            this.eventListeners.get(eventType)!.delete(listener);
        }
    }

    public dispatchEvent(event: ModifierEvent, params: any): void {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event)!.forEach((listener) => listener(event,params));
        }
    }

    private constructor() {}

    public static getInstance(): ModifierEventDispatcher {
        if (!ModifierEventDispatcher.instance) {
            ModifierEventDispatcher.instance = new ModifierEventDispatcher();
        }
        return ModifierEventDispatcher.instance;
    }

    private static instance: ModifierEventDispatcher;
   
}




export abstract class Modifier {
    public stackCount: number = 1;
    public attribute: ModifierAttribute;

    protected caster: ECSEntity | null = null;
    protected ability: BaseAbility | null = null;
    protected auraOwner: ECSEntity | null = null;
    protected timer: Timer;

    constructor(
        public id: string,
        public duration: number = Infinity,
        public isHidden: boolean = false,
        public isDebuff: boolean = false,
        public purgable: boolean = true,
        public priority: number = 0,
        attribute: ModifierAttribute = ModifierAttribute.MODIFIER_ATTRIBUTE_NONE
    ) {
        this.attribute = attribute;
    }

    public update(deltaTime: number): void {
        if (this.timer) {
            this.timer.update(deltaTime);
        }
        if (this.duration !== Infinity) {
            this.duration -= deltaTime;
            if (this.duration <= 0) {
                this.OnDestroy();
            }
        }
    }

   
    public IsDebuff(): boolean { return this.isDebuff; }
    public IsPurgable(): boolean { return this.purgable; }

    public OnCreated(): void {}
    public OnRefresh(): void {}
    public OnDestroy(): void {}

    protected SetStackCount(count: number): void { this.stackCount = count; }
    protected IncrementStackCount(): void { this.stackCount++; }

    protected StartIntervalThink(thinkInterval: number) {
        if (!this.timer) {
            this.timer = new Timer(thinkInterval, this.OnIntervalThink.bind(this));
        }
        this.timer.setInterval(thinkInterval);
    }

    protected OnIntervalThink() {}

    // abstract ListModifierCategory(): ModifierCategory[]; // 作用范围

    abstract ListModifierFunctions(): ModifierFunction[]; // 作用属性


    abstract ListListenEvents(): ModifierEvent[];

    getModifierValue(func: ModifierFunction): number {
        const declaredFunctions = this.ListModifierFunctions();
        if (declaredFunctions.includes(func)) {
            return this.getModifierValueInternal(func);
        }
        return 0;
    }

    onModifierEvent(event: ModifierEvent, params: any): void{
        this.onModifierEventInternal(event, params);
    };

    protected abstract onModifierEventInternal(event: ModifierEvent, params: any): void;

    protected abstract getModifierValueInternal(func: ModifierFunction): number;

    abstract checkState(): Map<ModifierState, boolean>;

    getModifierState(state: ModifierState): boolean {
        return this.checkState().get(state) || false;
    }

    public handleStacking(newModifier: Modifier) {
        if (this.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_MULTIPLE)) {
            this.IncrementStackCount();
        } else if (this.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_STACKABLE)) {
            this.stackCount += newModifier.stackCount;
        } else if (this.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_REFRESH_ON_STACK)) {
            this.duration = newModifier.duration;
        } else if (this.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_UNIQUE)) {
        // 不做任何操作，保持唯一性
        } else {
        // 默认行为：刷新持续时间
            this.duration = newModifier.duration;
        }
        this.OnRefresh();
    }

    

    public setCaster(caster: ECSEntity): void { this.caster = caster; }
    public getCaster(): ECSEntity | null { return this.caster; }
    public setAbility(ability: BaseAbility): void { this.ability = ability; }
    public getAbility(): BaseAbility | null { return this.ability; }
    public setAuraOwner(owner: ECSEntity): void { this.auraOwner = owner; }
    public getAuraOwner(): ECSEntity | null { return this.auraOwner; }

    public isAura(): boolean { return false; }
    public createAuraEffect(target: ECSEntity): Modifier | null { return null; }
    public getAuraRadius(): number { return 0; }
    // public shouldApplyToTarget(target: ECSEntity): boolean { return true; }

    public hasAttribute(attr: ModifierAttribute): boolean {
        return (this.attribute & attr) !== 0;
    }

    public getRemainingDuration(): number { return this.duration; }
    public isExpired(): boolean { return this.duration <= 0; }

    public abstract getAffectedComponentTypes(): Set<Function>;
    public abstract clone(): Modifier;


    public shouldRemoveOnDeath(): boolean {
        return this.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_REMOVE_ON_DEATH);
    }

    public IsHidden(): boolean {
        return this.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_HIDDEN);
    }

    public ignoreTenacity(): boolean {
    return this.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_IGNORE_TENACITY);
    }
}



// export class SpeedModifier extends Modifier {
//     private duration: number;
//     private elapsedTime: number = 0;
//     private speedBonus: number;

//     constructor(id: string, entity: ECSEntity, duration: number, speedBonus: number) {
//         super(id, entity);
//         this.duration = duration;
//         this.speedBonus = speedBonus;
//     }

//     OnCreated(): void {
//         // 初始化逻辑
//     }

//     OnDestroy(): void {
//         // 清理逻辑
//     }

//     ListDeclareFunctions(): ModifierFunction[] {
//         return [ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE];
//     }

//     getModifierValue(func: ModifierFunction, entity: ECSEntity): number {
//         if (func === ModifierFunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE) {
//             return this.speedBonus;
//         }
//         return 0;
//     }

//     getModifierState(state: ModifierState): boolean {
//         return false;
//     }

//     update(deltaTime: number): void {
//         this.elapsedTime += deltaTime;
//     }

//     isExpired(): boolean {
//         return this.elapsedTime >= this.duration;
//     }
// }



//  class AttributeBonusModifier extends Modifier {
//     constructor() {
//         super("attribute_bonus", Infinity, false, false, false, 100);
//     }

//     ListDeclareFunctions(): ModifierFunction[] {
//         return [ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS];
//     }

//     protected getModifierValueInternal(func: ModifierFunction, entity: ECSEntity): number {
//         if (func === ModifierFunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS) {
//             return 30;
//         }
//         return 0;
//     }
// }
  
// class GodsStrengthModifier extends Modifier {
//     constructor() {
//         super("gods_strength", 25, false, false, true, 10);
//     }

//     ListDeclareFunctions(): ModifierFunction[] {
//         return [ModifierFunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE];
//     }

//     protected getModifierValueInternal(func: ModifierFunction, entity: ECSEntity): number {
//         if (func === ModifierFunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE) {
//             const level = entity.getLevel();
//             if (level < 11) return 80;
//             if (level < 16) return 120;
//             return 160;
//         }
//         return 0;
//     }
// }


//  class StunModifier extends Modifier {
//     constructor(duration: number) {
//         super("stun", duration, false, true, true, 100);
//     }

//     ListDeclareFunctions(): ModifierFunction[] {
//         return [];  // 眩晕可能不直接修改属性
//     }

//     protected getModifierValueInternal(func: ModifierFunction, entity: ECSEntity): number {
//         return 0;  // 眩晕可能不直接修改属性值
//     }

//     checkState(): Map<ModifierState, boolean> {
//         return new Map([
//             [ModifierState.MODIFIER_STATE_STUNNED, true]
//         ]);
//     }
// }





//  在Dota 2中，一个单位的法力再生（mana regen）是由多个组件构成的，包括基础法力再生、法力再生速度的加成、百分比加成和flat（固定值）加成。当你查看一个单位的法力再生时，显示的值是所有这些因素计算之后的总和。
// 以下是法力再生计算的一些主要组成部分：
// 基础法力再生：每个英雄都有一个基础法力再生速度，这也可能会随着英雄等级的提升而增加。
// 属性加成：英雄的智力直接影响法力再生。智力提供了基于每一点智力的固定法力再生。
// 固定值（flat）加成：一些物品和技能提供固定值的法力再生，如GetModifierConstantManaRegen方法所返回的值。
// 百分比加成：某些物品或能力可能提供基于当前法力再生的百分比加成。这通常是以GetModifierPercentageManaRegen（Lua脚本中的方法名）的形式实现。
// 当然，还有一些其他的buff或debuff可能影响单位的法力再生速度，例如特定的技能效果或状态效果（如沉默或魔法免疫）。
// 计算单位的法力再生时，Dota 2游戏引擎会这样进行：
// 合计单位的基础法力再生和从英雄智力属性获取的基础法力再生。
// 添加所有提供固定数值加成的效果（包括物品和modifier提供的加成）。
// 应用百分比法力再生加成，通常基于前两部分已计算出的法力再生速度增加相应百分比的加成。
// 如果有其他特殊的法力再生机制或效果，也将在此时计算。
// 最后，所有这些值加在一起形成单位的总法力再生值。游戏内的UI通常会在单位的法力条旁边实时显示这个总值，玩家可以通过鼠标悬停在该值上查看更详细的信息。
// 单位每秒的法力再生总量会显示在HUD上，可通过鼠标悬停在法力条旁边的小蓝瓶图标上查看具体的数值。这个总量反映了所有当前影响单位的法力再生的效应的净效果。


//  function modifier_alchemist_acid_spray_lua:IsStunDebuff()
// 	return false
// end



//  function modifier_alchemist_acid_spray_lua:OnCreated( kv )
// 	-- references
// 	local interval = self:GetAbility():GetSpecialValueFor( "tick_rate" )
// 	local damage = self:GetAbility():GetSpecialValueFor( "damage" )
// 	self.armor = -self:GetAbility():GetSpecialValueFor( "armor_reduction" )
// 	self.radius = self:GetAbility():GetSpecialValueFor( "radius" )

// 	self.thinker = kv.isProvidedByAura~=1

// 	if not IsServer() then return end
// 	if not self.thinker then return end

// 	-- precache damage
// 	self.damageTable = {
// 		victim = target,
// 		attacker = self:GetCaster(),
// 		damage = damage,
// 		damage_type = self:GetAbility():GetAbilityDamageType(),
// 		ability = self:GetAbility(), --Optional.
// 	}
// 	-- ApplyDamage(damageTable)

// 	-- Start interval
// 	self:StartIntervalThink( interval )

// 	-- precache effects
// 	self.sound_cast = "Hero_Alchemist.AcidSpray.Damage"

// 	-- Play effects
// 	self:PlayEffects()
// end

// function modifier_alchemist_acid_spray_lua:OnRefresh( kv )
	
// end

// function modifier_alchemist_acid_spray_lua:OnRemoved()
// end

// function modifier_alchemist_acid_spray_lua:OnDestroy()
// 	if not IsServer() then return end
// 	if not self.thinker then return end

// 	UTIL_Remove( self:GetParent() )
// end




// function modifier_elevate_effect:DeclareFunctions()
//     return { MODIFIER_PROPERTY_OVERRIDE_ANIMATION }
// end

// function modifier_elevate_effect:GetOverrideAnimation(params)
//     return ACT_DOTA_FLAIL -- 或者其他适合的动画效果
// end

// -- 如果需要可以添加特殊的视觉或音效效果。
// function modifier_elevate_effect:PlayEffects()
//     -- 这里写上改变单位外观使其浮空的特效代码
// end

//  与此同时，CheckState()方法用于改变一个单位的各种状态。
//  这个方法返回一个表，每个键对应于一个状态，
//  并且对应的值是true或false来表示是否应用这个状态。在你提供的代码段里：
// MODIFIER_STATE_STUNNED是键，它代表着'眩晕'状态，
// 键对应的值为true表示这个modifier应用了'眩晕'状态到被添加到的单位。
// 这可以改变单位的行为，使之不能移动、攻击或者施放大多数的技能。
// 简而言之，DeclareFunctions()用于定义modifier影响的属性，而CheckState()用于定义modifier影响的状态。

//  function modifier_custom_stun:CheckState()
//     local state = {
//         [MODIFIER_STATE_STUNNED] = true,
//     }

//     return state
// end



// DeclareFunctions()方法的目的是声明这个modifier将要改变的一系列属性或者是将要添加的功能。
// 基本上，该方法返回一个包含函数枚举的表（table），
// 这些函数枚举用来告诉Dota 2引擎这个modifier将会影响哪些单位属性。在你提供的代码段里：

// 这里MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS代表你的这个modifier将会改变单位的物理护甲值。
// 这个列表可以有很多项，取决于modifier希望影响的所有不同属性。
// 与此同时，CheckState()方法用于改变一个单位的各种状态。
// 这个方法返回一个表，每个键对应于一个状态，并且对应的值是true或false来表示是否应用这个状态。在你提供的代码段里：
// function modifier_custom_debuff:DeclareFunctions()
//     local funcs = {
//         MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS, -- 护甲修改
//     }
//     return funcs
// end

// function modifier_custom_debuff:GetModifierPhysicalArmorBonus(params)
//     return -5
// end