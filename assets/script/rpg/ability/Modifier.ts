import { Timer } from "../../core/common/timer/Timer";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierAttribute, ModifierFunction, ModifierState } from "../enum/Modifier";
import { BaseAbility } from "./BaseAbility";


// 例如，你可能想要把 value 当做基础的变化值，intensity 用来增强或者削弱这个基础效果。在这个框架里，
// 可以用 value来表示基础速度或者基础伤害，然后 intensity 用来影响这个基础速度或者基础伤害的强度。
// 对应到上述移动速度减缓的例子，可以将value用作基础减速值，
// 然后用intensity来增强这个减速效果。例如，如果value是10，intensity是0.2
// ，那么移动速度减缓为基础速度的10%，然后再额外减缓20%，即最终减缓比例为12%(=10% + 10%*0.2)。

// import { ECSEntity } from "../ecs/ECSEntity";
// import { Modifier } from "./Modifier";

// export class BuffEffect {
//     public effectType: EffectType
//     public value: number
//     public intensity: number

//     // 新增一个属性保存应用的效果值
//     public effectAppliedValue: number = 0;

//     public applyEffect(entity: ECSEntity) {
//         if (this.effectType == EffectType.moveSpeedBonusPercentage) {
//             const movable = entity.getComponent(MovableComponent);
//             if (movable) {
//                 // 先减缓基础速度的百分比，再乘以强度
//                 this.effectAppliedValue = movable.speed * this.value * (1 + this.intensity);
//                 movable.speed -= this.effectAppliedValue;
//             }
//         }

//         // TODO: Handle other effect types...
//     }

//     public expireEffect(entity: ECSEntity) {
//         if (this.effectType == EffectType.moveSpeedBonusPercentage) {
//             const movable = entity.getComponent(MovableComponent);
//             if (movable) {
//                 // Restore the speed to its original value
//                 movable.speed += this.effectAppliedValue;
//                 this.effectAppliedValue = 0;
//             }
//         }

//         // TODO: Handle other effect expiration...
//     }
// }


// export enum BuffType {
//     BUFF = 0,
//     DEBUFF = 1
// }

// 有很多种实现强度增益的方式，但是具体的实现方式取决于你的设计需求。以下是一些常见的方式：
// **直接相加：**强度每次增加一个固定的值。比如初次Buff为10%移动速度，强度为1，下一次Buff叠加后，强度增加固定值1变为2，移动速度变为(1+1) * 10% = 20%。
// **百分比增加：**强度以固定的百分比增加。比如初次Buff为10%移动速度，强度为1，下一次Buff叠加后，强度以固定的百分比增加，比如10%，那么移动速度则变为 1.1*10%=11%。
// **指数增加：**强度以给定值的指数增加。例如，初次Buff为10%移动速度，强度为1，下次Buff叠加后，比如让强度的增长为指数增长，设强度立方（或者其他幂），则移动速度为1^310% = 10%，下一次为2^310% = 80%。



// EffectWithIntensity：这个名字表达了这个结构体包含了一个效果和一个强度。
// BuffProperty：这个名字用了更通用的“属性”字样，可以代表各种不同的属性，比如移动速度奖励、暴击几率增加等。
// BuffParameter：表示构成 Buff 的重要参数。
// public healthRegenIncrease?: number;     // 增加的生命回复速度
//     public manaRegenIncrease?: number;       // 增加的法力回复速度
//     public damageIncrease?: number;          // 增加的伤害值
//     public armorIncrease?: number;           // 增加的护甲值
//     public magicResistanceIncrease?: number; // 增加的魔法抗性

// export enum EffectType {
//     moveSpeedBonusPercentage = 1,
//     critChanceIncrease = 2,
//     critMultiplierIncrease = 3,
//     //...
// }


export interface IModifierEffect {
    applyEffect(entity: ECSEntity): void 
    removeEffect(entity: ECSEntity): void 
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

    public IsHidden(): boolean { return this.isHidden; }
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

    abstract ListDeclareFunctions(): ModifierFunction[];

    getModifierValue(func: ModifierFunction, entity: ECSEntity): number {
        const declaredFunctions = this.ListDeclareFunctions();
        if (declaredFunctions.includes(func)) {
            return this.getModifierValueInternal(func, entity);
        }
        return 0;
    }

    protected abstract getModifierValueInternal(func: ModifierFunction, entity: ECSEntity): number;

    abstract checkState(): Map<ModifierState, boolean>;

    getModifierState(state: ModifierState): boolean {
        return this.checkState().get(state) || false;
    }

    public handleStacking(newModifier: Modifier) {
        if (this.hasAttribute(ModifierAttribute.MODIFIER_ATTRIBUTE_MULTIPLE)) {
            this.IncrementStackCount();
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
    public shouldApplyToTarget(target: ECSEntity): boolean { return true; }

    public hasAttribute(attr: ModifierAttribute): boolean {
        return (this.attribute & attr) !== 0;
    }

    public getRemainingDuration(): number { return this.duration; }
    public isExpired(): boolean { return this.duration <= 0; }

    public abstract getAffectedComponentTypes(): Set<Function>;
    public abstract clone(): Modifier;
}





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



// export interface IModifierValueGetter {
//     (args?: any): number;
// }

// // 这个接口用于事件处理函数，如 OnAttacked。
// export interface IModifierEventHandler {
//     (params: any): void; 
// }

// export type IModifierStateInterface = {
//     [state : number]: boolean;
// };

// function isModifierValueGetter(functionToCheck: any): functionToCheck is IModifierValueGetter {
//     return functionToCheck && typeof(functionToCheck) === 'function' && functionToCheck.length === 0;
// }

// // ModifierMapping 类来管理 ModifierFunction 与 IModifierGetter 之间的关系
// export class ModifierMapping {

//     private modifierGetterMap: Map<ModifierFunction, IModifierValueGetter[]> = new Map();
//     private modifierEventMap: Map<ModifierFunction, IModifierEventHandler[]> = new Map();
    
//     private static inst: ModifierMapping;
//     static ins(): ModifierMapping {
//         if (!this.inst) {
//             this.inst = new ModifierMapping();
//         }
//         return this.inst;
//     }

//     // 添加处理器，既可以是值获取器，也可以是事件处理器
//     public add(func: ModifierFunction , getterOrHandler: IModifierValueGetter | IModifierEventHandler): void {
//         if (isModifierValueGetter(getterOrHandler)) {
//             const getters = this.modifierGetterMap.get(func) || [];
//             getters.push(getterOrHandler);
//             this.modifierGetterMap.set(func, getters);
//         } else {
//             const handlers = this.modifierEventMap.get(func) || [];
//             handlers.push(getterOrHandler);
//             this.modifierEventMap.set(func, handlers);
//         }
//     }

//     // 从值获取器 Map 中移除处理器
//     public remove(func: ModifierFunction , getter: IModifierValueGetter): void {
//         const getters = this.modifierGetterMap.get(func);
//         if (getters) {
//             const index = getters.indexOf(getter);
//             if (index !== -1) {
//                 getters.splice(index, 1); // 从列表中移除 getter
//                 if (getters.length === 0) {
//                     this.modifierGetterMap.delete(func); // 列表为空则删除该键
//                 } else {
//                     this.modifierGetterMap.set(func, getters); // 更新列表
//                 }
//             }
//         }
//     }

//     public get(func: ModifierFunction): IModifierValueGetter[] {
//         return this.modifierGetterMap.get(func) || [];
//     }

//     public calculateModifierTotalValue(func: ModifierFunction): number {
//         let list =  this.modifierGetterMap.get(func) ;
//         if(!list) return 0
//         let totalValue = 0;
//         list.forEach(getter => {
//             totalValue += getter();
//         });
//         return totalValue;
//     }


//      // 添加一个新的方法来触发事件
//      public triggerEvent(func: ModifierFunction, params: any): void {
//         const handlers = this.modifierEventMap.get(func);
//         if (handlers) {
//             handlers.forEach(handler => {
//                 handler(params);
//             });
//         }
//     }

//     public clear(): void {
//         this.modifierGetterMap.clear();
//         this.modifierEventMap.clear();
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


//  属性修改类
//  MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE：预攻击伤害。
//  MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE：基础攻击伤害。
//  MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT：攻击速度。
//  MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE：临时致命一击倍数。
//  MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT：移动速度。
//  MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE：移动速度百分比。
//  MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS：物理护甲。
//  MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE：魔法增强（百分比）。
//  MODIFIER_PROPERTY_HEALTH_BONUS：生命值加成。
//  MODIFIER_PROPERTY_MANA_BONUS：魔法值加成。
//  MODIFIER_PROPERTY_MANA_REGEN_CONSTANT：固定魔法恢复。
//  MODIFIER_PROPERTY_MANA_REGEN_PERCENTAGE：魔法恢复（百分比）。
//  MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT：固定生命恢复。
//  MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE：生命恢复（百分比）。
//  MODIFIER_PROPERTY_MAGIC_RESISTANCE_BONUS：魔法抗性。
//  MODIFIER_PROPERTY_MAGIC_RESISTANCE_DIRECT_MODIFICATION：直接修改的魔法抗性。
//  MODIFIER_PROPERTY_COOLDOWN_REDUCTION_CONSTANT：冷却时间减少。
//  状态修改类
//  MODIFIER_PROPERTY_OVERRIDE_ANIMATION：覆盖动画。
//  MODIFIER_PROPERTY_OVERRIDE_ANIMATION_WEIGHT：覆盖动画权重（高优先级）。
//  MODIFIER_PROPERTY_OVERRIDE_ANIMATION_RATE：覆盖动画速率。
//  MODIFIER_PROPERTY_INVISIBILITY_LEVEL：隐身等级。
//  MODIFIER_PROPERTY_PERSISTENT_INVISIBILITY：持久隐身。
//  效果添加类（效果添加到单位，用于影响单位的状态）
//  MODIFIER_STATE_STUNNED：眩晕。
//  MODIFIER_STATE_HEXED：妖术。
//  MODIFIER_STATE_SILENCED：沉默。
//  MODIFIER_STATE_ROOTED：定身。
//  MODIFIER_STATE_DISARMED：缴械。
//  MODIFIER_STATE_INVISIBLE：隐身。
//  MODIFIER_STATE_MUTED：禁用物品。
//  MODIFIER_STATE_BLIND：致盲。
//  MODIFIER_STATE_BLOCK_DISABLED：无法进行伤害格挡。
//  MODIFIER_STATE_NO_HEALTH_BAR：没有生命条显示。
//  MODIFIER_STATE_FLYING：允许飞行动作。
//  其他特殊功能
//  MODIFIER_EVENT_ON_ATTACK_START：攻击开始时。
//  MODIFIER_EVENT_ON_ATTACK_LANDED：攻击命中时。
//  MODIFIER_EVENT_ON_ATTACK_FAIL：攻击失误时。
//  MODIFIER_EVENT_ON_SPELL_TARGET_READY：施法目标就绪时。
//  MODIFIER_EVENT_ON_SPELL_START：开始施法时。
//  MODIFIER_EVENT_ON_DAMAGE_CALCULATED：伤害计算之后。
//  MODIFIER_EVENT_ON_DEATH：单位死亡时。
//  MODIFIER_EVENT_ON_RESPAWN：单位重生时。






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