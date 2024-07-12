import { AbilityData } from "./AbilityData";
import { ECSEntity } from "../ecs/ECSEntity";
import { ModifierManager } from "../manager/ModifierManager";
import { DamageType } from "../enum/Damage";
import { AttackComponent } from "../component/AttackComponent";
import { AbilityBehavior } from "../enum/Type";
import { AbilityInputHandlerFactory } from "../input/AbilityInputHandlerFactory";
import { AbilityInputHandler } from "../input/AbilityInputHandler";
import { Vec2 } from "cc";

// OnAbilityPhaseStart(): boolean; 这个函数在英雄开始释放技能，也就是技能施法前摇的时候被调用。如果这个函数返回true，英雄会继续施法，然后OnSpellStart() 会被调用。如果返回false，英雄将取消施法，并且OnSpellStart() 不会被调用。
// 这两者的主要区别在于，OnSpellStart(): void; 是在技能成功释放后调用的，而 OnAbilityPhaseStart(): boolean; 是在技能开始施法的时候调用。所以这两者的主要区别在于它们影响技能何时启动，以及技能的效果何时产生。






export abstract class BaseAbility {
    protected abilityName: string;
    protected index: number;
    protected abilityData: AbilityData;
    protected level: number;
    protected toggled: boolean;
    protected caster: ECSEntity | null;
    protected cooldownTimeRemaining: number;
    private channelThinkInterval: number | null; // 对应的timeout id
    private activated: boolean; // 是否已经开始施法

    protected inputHandler: AbilityInputHandler;

    constructor(abilityName: string, index: number, abilityData: AbilityData) {
        this.abilityName = abilityName;
        this.index = index;
        this.abilityData = abilityData;
        this.level = 0;
        this.toggled = false;
        this.caster = null;
        this.cooldownTimeRemaining = 0;
        this.channelThinkInterval = null;
        this.inputHandler = AbilityInputHandlerFactory.createHandler(this);
    }


    public handleInput(eventType: string, event: TouchEvent): void {
        this.inputHandler.handleInput(eventType, event);
    }

    public GetAbilityIndex(): number {
        return this.index;
    }

    public GetAbilityName(): string {
        return this.abilityName;
    }

    public GetLevel(): number {
        return this.level;
    }

    public IsActivated(): boolean {
        return this.activated;
    }

    public GetCaster(): ECSEntity | null {
        return this.caster;
    }

    public SetCaster(caster: ECSEntity): void {
        this.caster = caster;
    }

    public GetSpecialValueFor(name: string): number {
        return this.abilityData.GetLevelSpecialValueFor(name, this.level);
    }

    public GetMaxLevel(): number {
        return this.abilityData.GetMaxLevel();
    }

    public GetCooldownTime(): number {
        return this.abilityData.GetCooldown(this.level);
    }

    public GetManaCost(): number {
        return this.abilityData.GetManaCost(this.level);
    }

    public GetCastRange(): number {
        return this.abilityData.GetCastRange();
    }

    public GetAbilityData(): AbilityData {
        return this.abilityData;
    }

    public UpdateCooldown(deltaTime: number): void {
        this.cooldownTimeRemaining = Math.max(0, this.cooldownTimeRemaining - deltaTime);
    }

    public StartCooldown(): void {
        this.cooldownTimeRemaining = this.GetCooldownTime();
    }

    public IsInCooldown(): boolean {
        return this.cooldownTimeRemaining > 0;
    }

    public GetRemainingCooldown(): number {
        return this.cooldownTimeRemaining;
    }

    public IsToggled(): boolean {
        return this.toggled;
    }

    public SetChannelThinkInterval(interval: number): void {
        this.channelThinkInterval = interval;
    }

    public GetChannelThinkInterval(): number | null {
        return this.channelThinkInterval;
    }

    public GetBehavior(): AbilityBehavior {
        return this.abilityData.GetBehavior();
    }

    public GetCastPoint(): number {
        return this.abilityData.GetCastPoint(this.level);
    }
    
    public GetChannelTime(): number {
        return this.abilityData.GetChannelTime(this.level);
    }

    
    

    // 以下方法可以被子类重写
    public OnAbilityPhaseStart(): boolean { return true; }
    public OnAbilityPhaseInterrupted(): void {}
    public OnSpellStart(): void {}
    public OnChannelFinish(interrupted: boolean): void {}
    public OnChannelThink(interval: number): void {}
    public OnToggleThink(deltaTime: number): void {}
    public OnUpgrade(): void { this.level++; }
    public OnToggle(): void { this.toggled = !this.toggled; }
    public OnSpellFinish(): void {}
    public RequiresFacing(): boolean { return true; }
    public CanBeExecuted(): boolean { return !this.IsInCooldown(); }
    public GetAbilityDamage(): number { return 0; }
    public GetAOERadius(): number { return 0; }
    public IsHidden(): boolean { return false; }
    public IsPassive(): boolean { return false; }
    public ShouldTriggerAutoCast(): boolean { return false; }
    public OnSpellTargetReady(): void {}
    public OnAbilityDealDamage(target: ECSEntity, damage: number, damageType: DamageType): void {}
    public OnOwnerTakeDamage(attacker: ECSEntity, damage: number, damageType: DamageType): void {}
    public OnOwnerDealDamage(target: ECSEntity, damage: number, damageType: DamageType): void {}

    public OnOwnerDied(): void {}
    public OnOwnerSpawned(): void {}
}




export class BaseAttackAbility extends BaseAbility {
    constructor(abilityData: AbilityData) {
        super("base_attack", 0, abilityData);
    }

    public OnAttack(target: ECSEntity | null): void {
        if (!target) return;

        const caster = this.GetCaster();
        if (!caster) return;

        const damage = this.GetAttackDamage();
        const damageType = this.GetAbilityData().GetAbilityDamageType();

        // 这里可以添加特殊的攻击效果逻辑

        // 触发伤害事件
        // this.DealDamage(caster, target, damage, damageType);
    }

    private GetAttackDamage(): number {
        const caster = this.GetCaster();
        if (!caster) return 0;

        const attackComponent = caster.getComponent(AttackComponent) ;
        return attackComponent.getBaseAttackDamage();
    }
}



// import { BaseAbility } from './BaseAbility';
// import { AbilityData } from './AbilityData';
// import { Unit } from './Unit';
// import { ModifierManager } from './ModifierManager';
// import { BladeFuryModifier } from './BladeFuryModifier';

// export class BladeFuryAbility extends BaseAbility {
//     constructor(abilityName: string, index: number, abilityData: AbilityData) {
//         super(abilityName, index, abilityData);
//     }

//     public OnSpellStart(): void {
//         super.OnSpellStart();

//         const caster = this.GetCaster();
//         if (!caster) return;

//         const duration = this.GetSpecialValueFor('duration');
//         const radius = this.GetSpecialValueFor('radius');
//         const damagePerSecond = this.GetAbilityDamage();

//         // 创建并应用BladeFuryModifier
//         const modifier = new BladeFuryModifier(
//             this,
//             caster,
//             duration,
//             radius,
//             damagePerSecond
//         );

//         ModifierManager.getInstance().addModifier(caster, modifier);

//         // 播放音效和特效
//         // PlaySound('Hero_Juggernaut.BladeFury');
//         // PlayParticleEffect('particles/units/heroes/hero_juggernaut/juggernaut_blade_fury.vpcf', caster);
//     }

//     public GetAbilityDamage(): number {
//         return this.GetSpecialValueFor('blade_fury_damage');
//     }

//     public OnChannelFinish(interrupted: boolean): void {
//         super.OnChannelFinish(interrupted);

//         const caster = this.GetCaster();
//         if (!caster) return;

//         // 移除BladeFuryModifier
//         ModifierManager.getInstance().removeModifier(caster, 'modifier_juggernaut_blade_fury');
//     }
// }



// const bladeFuryData = new AbilityData({
//     BaseClass: "ability_lua",
//     AbilityTextureName: "juggernaut_blade_fury",
//     AbilityBehavior: "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_CHANNELLED",
//     AbilityUnitDamageType: "DAMAGE_TYPE_MAGICAL",
//     SpellImmunityType: "SPELL_IMMUNITY_ENEMIES_NO",
//     AbilityCastPoint: "0",
//     AbilityChannelTime: "5",
//     AbilityCooldown: "42 34 26 18",
//     AbilityManaCost: "120 110 100 90",
//     AbilitySpecial: {
//         "01": { "var_type": "FIELD_INTEGER", "blade_fury_damage": "80 105 130 155" },
//         "02": { "var_type": "FIELD_INTEGER", "blade_fury_radius": "250" },
//         "03": { "var_type": "FIELD_FLOAT", "duration": "5" }
//     }
// });



// import { Modifier } from './Modifier';
// import { ModifierFunction } from './ModifierFunction';
// import { ModifierState } from './ModifierState';
// import { DamageType } from './DamageType';
// import { Unit } from './Unit';
// import { BaseAbility } from './BaseAbility';

// export class BladeFuryModifier extends Modifier {
//     private radius: number;
//     private damagePerSecond: number;
//     private damageInterval: number = 0.5; // 每0.5秒造成一次伤害
//     private lastDamageTime: number = 0;

//     constructor(ability: BaseAbility, caster: Unit, duration: number, radius: number, damagePerSecond: number) {
//         super(
//             'modifier_juggernaut_blade_fury',
//             duration,
//             false,
//             false,
//             false,
//             100,
//             ModifierAttribute.MODIFIER_ATTRIBUTE_MULTIPLE
//         );
//         this.setCaster(caster);
//         this.setAbility(ability);
//         this.radius = radius;
//         this.damagePerSecond = damagePerSecond;
//     }

//     public OnCreated(): void {
//         super.OnCreated();
//         this.StartIntervalThink(0.03); // 每帧更新
//     }

//     public OnIntervalThink(): void {
//         const currentTime = Date.now() / 1000;
//         if (currentTime - this.lastDamageTime >= this.damageInterval) {
//             this.DealDamageToNearbyEnemies();
//             this.lastDamageTime = currentTime;
//         }
//     }

//     private DealDamageToNearbyEnemies(): void {
//         const caster = this.getCaster();
//         if (!caster) return;

//         const nearbyEnemies = this.GetNearbyEnemies(caster, this.radius);
//         const damagePerTick = this.damagePerSecond * this.damageInterval;

//         for (const enemy of nearbyEnemies) {
//             // 在实际游戏中,你需要实现一个伤害系统来处理这个
//             // ApplyDamage({
//             //     victim: enemy,
//             //     attacker: caster,
//             //     damage: damagePerTick,
//             //     damage_type: DamageType.DAMAGE_TYPE_MAGICAL
//             // });
//         }
//     }

//     public ListDeclareFunctions(): ModifierFunction[] {
//         return [ModifierFunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_MAGICAL];
//     }

//     public GetModifierAbsoluteNoDamageMagical(): 1 | 0 {
//         return 1; // 提供魔法免疫
//     }

//     public CheckState(): Map<ModifierState, boolean> {
//         const state = new Map<ModifierState, boolean>();
//         state.set(ModifierState.MODIFIER_STATE_MAGIC_IMMUNE, true);
//         return state;
//     }

//     private GetNearbyEnemies(unit: Unit, radius: number): Unit[] {
//         // 在实际游戏中,你需要实现一个方法来获取附近的敌人
//         // 这里只是一个占位符
//         return [];
//     }
// }




// const bladeFury = new BladeFuryAbility("juggernaut_blade_fury", 0, bladeFuryData);



// const juggernaut = new ECSEntity();

// // 添加能力组件
// const abilityComponent = new AbilityComponent();
// juggernaut.addComponent(abilityComponent);

// // 初始化技能
// const bladeFuryData = new AbilityData({
//     // ... 技能数据保持不变
// });

// const bladeFury = new BladeFuryAbility("juggernaut_blade_fury", 0, bladeFuryData);
// abilityComponent.addAbility(bladeFury);

// // 激活实体
// juggernaut.setEnabled(true);




// // 获取剑圣的技能组件
// const abilityComponent = juggernaut.getComponent(AbilityComponent);

// // 使用技能
// const bladeFury = new BladeFuryAbility(bladeFuryData);
// bladeFury.SetCaster(hero);
// abilityComponent.addAbility(bladeFury);


// // 创建剑圣实体
// const juggernaut = new ECSEntity();

// // 添加能力组件
// const abilityComponent = new AbilityComponent(juggernaut.id);
// juggernaut.addComponent(abilityComponent);

// // 创建剑刃风暴技能
// const bladeFury = new BladeFuryAbility(bladeFuryData);
// abilityComponent.addAbility(bladeFury);

// // 使用技能
// if (bladeFury.CanBeExecuted()) {
//     bladeFury.OnSpellStart();
// }




// const bladeFuryData = new AbilityData({
//     BaseClass: "ability_lua",
//     ScriptFile: "abilities/juggernaut_blade_fury.lua",
//     AbilityTextureName: "juggernaut_blade_fury",
//     AbilityType: "DOTA_ABILITY_TYPE_BASIC",
//     AbilityUnitDamageType: "DAMAGE_TYPE_MAGICAL",
//     AbilityBehavior: "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_CHANNELLED",
//     AbilityUnitTargetTeam: "DOTA_UNIT_TARGET_TEAM_ENEMY",
//     AbilityUnitTargetType: "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC",
//     SpellImmunityType: "SPELL_IMMUNITY_ENEMIES_NO",
//     AbilityCastPoint: "0",
//     AbilityCooldown: "42 34 26 18",
//     AbilityManaCost: "120 110 100 90",
//     AbilityChannelTime: "5",
//     AbilitySpecial: {
//         "01": { "var_type": "FIELD_INTEGER", "blade_fury_radius": "250" },
//         "02": { "var_type": "FIELD_INTEGER", "blade_fury_damage": "80 105 130 155" },
//         "03": { "var_type": "FIELD_FLOAT", "duration": "5" }
//     }
// });


// class BladeFuryAbility extends BaseAbility {
//     constructor(abilityData: AbilityData) {
//         super("juggernaut_blade_fury", 0, abilityData);
//     }

//     public OnSpellStart(): void {
//         super.OnSpellStart();

//         const caster = this.GetCaster();
//         if (!caster) return;

//         const duration = this.GetSpecialValueFor('duration');
//         const radius = this.GetSpecialValueFor('blade_fury_radius');
//         const damagePerSecond = this.GetSpecialValueFor('blade_fury_damage');

//         const modifier = new BladeFuryModifier(
//             this,
//             caster.id,
//             duration,
//             radius,
//             damagePerSecond
//         );

//         ModifierManager.getInstance().addModifier(caster.id, modifier);
//     }
// }



// class BladeFuryModifier extends Modifier {
//     private radius: number;
//     private damagePerSecond: number;
//     private damageInterval: number = 0.5; // 每0.5秒造成一次伤害
//     private lastDamageTime: number = 0;

//     constructor(ability: BaseAbility, casterId: string, duration: number, radius: number, damagePerSecond: number) {
//         super(
//             'modifier_juggernaut_blade_fury',
//             duration,
//             false,
//             false,
//             false,
//             100,
//             ModifierAttribute.MODIFIER_ATTRIBUTE_MULTIPLE
//         );
//         this.setCaster(casterId);
//         this.setAbility(ability);
//         this.radius = radius;
//         this.damagePerSecond = damagePerSecond;
//     }

//     public OnIntervalThink(): void {
//         const currentTime = Date.now() / 1000;
//         if (currentTime - this.lastDamageTime >= this.damageInterval) {
//             this.DealDamageToNearbyEnemies();
//             this.lastDamageTime = currentTime;
//         }
//     }

//     private DealDamageToNearbyEnemies(): void {
//         const casterId = this.getCaster();
//         if (!casterId) return;

//         const nearbyEnemies = this.GetNearbyEnemies(casterId, this.radius);
//         const damagePerTick = this.damagePerSecond * this.damageInterval;

//         for (const enemyId of nearbyEnemies) {
//             const damageInfo: DamageInfo = {
//                 victim: enemyId,
//                 attacker: casterId,
//                 damage: damagePerTick,
//                 damageType: DamageType.DAMAGE_TYPE_MAGICAL,
//                 ability: this.getAbility()
//             };

//             DamageManager.getInstance().ApplyDamage(damageInfo);
//         }
//     }

//     private GetNearbyEnemies(entityId: string, radius: number): string[] {
//         // 实现获取附近敌人的逻辑
//         // 这里简化处理,返回一个假设的敌人列表
//         return ["enemy1", "enemy2", "enemy3"];
//     }
// }





// class AttackAbility extends BaseAbility {
//     constructor(abilityData: AbilityData) {
//         super("attack", 0, abilityData);
//     }

//     public OnSpellStart(): void {
//         const caster = this.GetCaster();
//         const target = this.GetCursorTarget();

//         if (!caster || !target) return;

//         const damage = this.GetAttackDamage(caster);
//         const attackRange = this.GetSpecialValueFor('attack_range');

//         if (this.IsInRange(caster, target, attackRange)) {
//             const damageInfo: DamageInfo = {
//                 attacker: caster,
//                 victim: target,
//                 damage: damage,
//                 damageType: DamageType.DAMAGE_TYPE_PHYSICAL,
//                 ability: this
//             };

//             DamageManager.getInstance().ApplyDamage(damageInfo);
//         }
//     }

//     private GetAttackDamage(caster: ECSEntity): number {
//         const attributeComponent = caster.getComponent('AttributeComponent') as AttributeComponent;
//         if (!attributeComponent) return 0;

//         const baseAttack = 50; // 假设的基础攻击力
//         const primaryAttributeBonus = attributeComponent.getPrimaryAttributeAsAttackPower();

//         return baseAttack + primaryAttributeBonus;
//     }

//     private IsInRange(caster: ECSEntity, target: ECSEntity, range: number): boolean {
//         // 实现距离检查逻辑
//         return true; // 简化版本
//     }
// }





// class BasicAttackAbility extends BaseAbility {
//     constructor(abilityData: AbilityData) {
//         super("basic_attack", 0, abilityData);
//     }

//     public OnSpellStart(): void {
//         const caster = this.GetCaster();
//         const target = this.GetCursorTarget();

//         if (!caster || !target) return;

//         const damage = this.GetAttackDamage(caster);
//         const attackRange = this.GetAttackRange(caster);

//         if (this.IsInRange(caster, target, attackRange)) {
//             const damageInfo: DamageInfo = {
//                 attacker: caster,
//                 victim: target,
//                 damage: damage,
//                 damageType: DamageType.DAMAGE_TYPE_PHYSICAL,
//                 ability: this
//             };

//             DamageManager.getInstance().ApplyDamage(damageInfo);
//         }
//     }

//     private GetAttackDamage(caster: ECSEntity): number {
//         const attributeComponent = caster.getComponent('AttributeComponent') as AttributeComponent;
//         const attackComponent = caster.getComponent('AttackComponent') as AttackComponent;
//         if (!attributeComponent || !attackComponent) return 0;

//         const baseAttack = attackComponent.getBaseAttackDamage();
//         const primaryAttributeBonus = attributeComponent.getPrimaryAttributeAsAttackPower();

//         return baseAttack + primaryAttributeBonus;
//     }

//     private GetAttackRange(caster: ECSEntity): number {
//         const attackComponent = caster.getComponent('AttackComponent') as AttackComponent;
//         return attackComponent ? attackComponent.getAttackRange() : 0;
//     }

//     private IsInRange(caster: ECSEntity, target: ECSEntity, range: number): boolean {
//         // 实现距离检查逻辑
//         return true; // 简化版本
//     }
// }




// 基于 ability 的普攻：
// 优点：
// 与其他技能保持一致的结构，便于管理和扩展。
// 可以更容易地实现特殊的攻击效果（如暴击、吸血等）。
// 可以利用现有的 ability 系统（如冷却、消耗等）。
// 缺点：
// 可能会增加系统的复杂性，特别是对于简单的普通攻击。
// 可能会导致一些性能开销，尤其是在大量单位同时攻击时。
// 不基于 ability 的普攻：
// 优点：
// 更简单直接，特别是对于标准的普通攻击。
// 可能有更好的性能，因为不需要经过 ability 系统。
// 更符合传统的游戏设计思路。
// 缺点：
// 如果需要实现复杂的攻击效果，可能需要额外的系统。
// 与技能系统的集成可能不如基于 ability 的方案紧密。
// 考虑到 Dota 2 的复杂性和可能的特殊攻击效果，我建议采用一个折中的方案：
// 保留 AttackComponent 来管理基本的攻击属性和逻辑。
// 创建一个基础的 AttackAbility，但只用于处理特殊效果和与其他系统的交互。
// 在 AttackComponent 中添加一个可选的 AttackAbility 引用。