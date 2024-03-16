import { Vec2 } from "cc";
import { AbilityData } from "./AbilityData";

// OnAbilityPhaseStart(): boolean; 这个函数在英雄开始释放技能，也就是技能施法前摇的时候被调用。如果这个函数返回true，英雄会继续施法，然后OnSpellStart() 会被调用。如果返回false，英雄将取消施法，并且OnSpellStart() 不会被调用。
// 这两者的主要区别在于，OnSpellStart(): void; 是在技能成功释放后调用的，而 OnAbilityPhaseStart(): boolean; 是在技能开始施法的时候调用。所以这两者的主要区别在于它们影响技能何时启动，以及技能的效果何时产生。

export class BaseAbility {
    private abilityName:string //技能名字
    private index:number //第几个技能
    private abilityData:AbilityData //技能基本设置的数据
    private level:number //当前级别
    private activated:boolean //是否激活

    public GetAbilityIndex():number{
        return this.index
    }

    public GetAbilityName():string{
        return this.abilityName
    }

    public GetLevel():number {
        return this.level
    }

    public IsActivated(): boolean{
        return this.activated
    }

    public GetCaster(): any{ //获取施法者

    }

    public GetSpecialValueFor(name:string):number{
        return this.abilityData.GetLevelSpecialValueFor(name,this.level)
    }

    public GetMaxLevel(): number{
        return this.abilityData.GetMaxLevel()
    }

    public RequiresFacing(): boolean{ //是否要求面向
        return true 
    }

    public OnAbilityPhaseInterrupted(): void{

    }


    public OnAbilityPhaseStart(): boolean{ //施法开始,返回false 则不进入 onSpellStart
        return true 
    }

    public OnSpellStart():void{ //当技能释放成功时

    }

    public OnUpgrade():void{ //当技能升级

    }

    public OnToggle():void{ //当技能切换

    }

    public OnChannelFinish(interrupted: boolean): void{

    }

    public OnChannelThink(interval: number): void{
        
    }

    public OnHeroLevelUp():void{

    }

    public OnOwnerDied():void{

    }

    public OnOwnerSpawned():void{

    }

    public GetCooldownTime(): number{
        return this.abilityData.GetCooldown(this.level)
    }

    public GetCooldownTimeRemaining(): number{//获取剩余冷却
        return 0
    }

    public StartCooldown(cooldown: number): void{ //开始技能冷却

    }

    public EndCooldown(): void{ //冷却结束

    }

    public ToggleAutoCast():void{ //切换到自动施法

    }

    public SetFrozenCooldown(frozenCooldown: boolean):void{ //设置是否冻结冷却时间

    }

    public GetCursorPosition():Vec2{
        return Vec2.ZERO
    }

    public GetCursorTarget():any{
        return 
    }

    public GetCursorTargetingNothing():boolean{
        return false
    }

    public EndChannel(interrupted: boolean): void{  //interrupted true 表示被打断，否则是正常结束

    }
}   





// class BaseAbility2 extends CBaseEntity {
//     CanAbilityBeUpgraded(): boolean;
//     CastAbility(): boolean;
//     ContinueCasting(): boolean;
//     CreateVisibilityNode(location: Vector, radius: number, duration: number): void;
//     DecrementModifierRefCount(): void;
//     EnableAbilityChargesOnTalentUpgrade(ability: object, talentName: string): void;
//     EndChannel(interrupted: boolean): void;
//     /**
//      * Clear the cooldown remaining on this ability.
//      */
//     EndCooldown(): void;
//     ForceSetFrozenCooldown(value: number): void;
//     GetAbilityChargeRestoreTime(level: number): number;
  
//     /**
//      * Gets the key values definition for this ability.
//      */
//     GetAbilityKeyValues(): object;
//     /**
//      * Returns the name of this ability.
//      *
//      * @both
//      */
  
//    GetBehaviorInt(): DOTA_ABILITY_BEHAVIOR;

//     GetAnimationIgnoresModelScale(): boolean;
//     GetAOERadius(): number;
//     GetAssociatedPrimaryAbilities(): string;
//     GetAssociatedSecondaryAbilities(): string;
//     GetAutoCastState(): boolean;
//     GetBackswingTime(): number;
//     /**
  
//     /**
//      * Get the owner of this ability.
//      *
//      * @both
//      */
//     GetCaster(): CDOTA_BaseNPC;
   
//     /** @both */
//     GetCastPointModifier(): number;
//     /**
//      * Gets the cast range of the ability.
//      */
//     GetCastRange(location: Vector | undefined, target: CDOTA_BaseNPC | undefined): number;
//     GetChannelledHealthCostPerSecond(level: number): number;
//     GetChannelledManaCostPerSecond(level: number): number;
//     GetChannelStartTime(): number;
//     GetChannelTime(): number;
//     GetCloneSource(): CDOTA_BaseNPC | undefined;
//     GetConceptRecipientType(): number;
//     /**
//      * Get the cooldown duration for this ability at a given level, not the amount of
//      * cooldown actually left.
//      */
//     GetCooldown(level: number): number;
//     GetCooldownTime(): number;
//     GetCooldownTimeRemaining(): number;
//     /**
//      * The number of charges remaining on this ability.
//      *
//      * @both
//      */
//     GetCurrentAbilityCharges(): number;
//     GetCursorPosition(): Vector;
//     GetCursorTarget(): CDOTA_BaseNPC | undefined;
//     GetCursorTargetingNothing(): boolean;
//     GetDuration(): number;
//     /**
//      * Gets the cast range of the ability, taking modifiers into account.
//      */
//     GetEffectiveCastRange(location: Vector, target: object): number;
//     GetEffectiveCooldown(level: number): number;
//     GetEffectiveHealthCost(level: number): number;
//     GetEffectiveManaCost(level: number): number;
//     GetGoldCost(level: number): number;
//     GetGoldCostForUpgrade(level: number): number;
//     GetHealthCost(level: number): number;
//     GetHeroLevelRequiredToUpgrade(): number;
//     GetInitialAbilityCharges(level: number): number;
//     GetIntrinsicModifierName(): string;
//     /**
//      * Get the current level of the ability.
//      *
//      * @both
//      */
//     GetLevel(): number;
//     /**
//      * Gets a value from this ability's special value block for passed level.
//      *
//      * @both
//      */
//     GetLevelSpecialValueFor(name: string, level: number): number;
//     /**
//      * Gets a value from this ability's special value block for passed level, ignoring
//      * MODIFIER_PROPERTY_OVERRIDE_ABILITY_SPECIAL.
//      *
//      * @both
//      */
//     GetLevelSpecialValueNoOverride(name: string, level: number): number;
//     GetManaCost(level: number): number;
//     GetMaxAbilityCharges(level: number): number;
//     GetMaxLevel(): number;
//     GetModifierValue(): number;
//     GetModifierValueBonus(): number;
//     GetPlaybackRateOverride(): number;
//     GetSharedCooldownName(): string;
//     /**
//      * Gets a value from this ability's special value block for its current level.
//      *
//      * @both
//      */
//     GetSpecialValueFor(name: string): number;
//     GetStolenActivityModifier(): string;
//     /**
//      * Whether or not this ability is toggled.
//      *
//      * @both
//      */
//     GetToggleState(): boolean;
//     GetUpgradeRecommended(): boolean;
//     HeroXPChange(xp: number): boolean;
//     IncrementModifierRefCount(): void;
//     IsActivated(): boolean;
//     IsAttributeBonus(): boolean;
//     /**
//      * Returns whether the ability is currently channeling.
//      */
//     IsChanneling(): boolean;
//     IsCooldownReady(): boolean;
//     IsCosmetic(entity: CBaseEntity): boolean;
//     /**
//      * Returns whether the ability can be cast.
//      */
//     IsFullyCastable(): boolean;
//     IsHidden(): boolean;
//     IsHiddenAsSecondaryAbility(): boolean;
//     IsHiddenWhenStolen(): boolean;
//     /**
//      * Returns whether the ability is currently casting.
//      */
//     IsInAbilityPhase(): boolean;
//     /**
//      * Whether or not this ability is an item.
//      *
//      * @both
//      */
//     IsItem(): this is CDOTA_Item;
//     IsOwnersGoldEnough(issuerPlayerId: PlayerID): boolean;
//     IsOwnersGoldEnoughForUpgrade(): boolean;
//     IsOwnersManaEnough(): boolean;
//     IsPassive(): boolean;
//     IsRefreshable(): boolean;
//     IsSharedWithTeammates(): boolean;
//     IsStealable(): boolean;
//     IsStolen(): boolean;
//     IsToggle(): boolean;
//     IsTrained(): boolean;
//     /**
//      * Mark the ability button for this ability as needing a refresh.
//      */
//     MarkAbilityButtonDirty(): void;
//     NumModifiersUsingAbility(): number;
//     OnAbilityPhaseInterrupted(): void;
    
//     OnAbilityPinged(playerId: PlayerID, ctrlHeld: boolean): void;
//     OnChannelFinish(interrupted: boolean): void;
//     OnChannelThink(interval: number): void;
//     OnHeroCalculateStatBonus(): void;
//     OnHeroLevelUp(): void;
//     OnOwnerDied(): void;
//     OnOwnerSpawned(): void;
//     OnSpellStart(): void;
//     OnAbilityPhaseStart(): boolean;
//     OnToggle(): void;
//     OnUpgrade(): void;


//     PayGoldCost(): void;
//     PayGoldCostForUpgrade(): void;
//     PayHealthCost(): void;
//     PayManaCost(): void;
//     PlaysDefaultAnimWhenStolen(): boolean;
//     ProcsMagicStick(): boolean;
//     RefCountsModifiers(): boolean;
//     RefreshCharges(): void;
//     RefreshIntrinsicModifier(): void;
//     RefundHealthCost(): void;
//     RefundManaCost(): void;
//     RequiresFacing(): boolean;
//     ResetToggleOnRespawn(): boolean;
//     SetAbilityIndex(index: number): void;
//     SetActivated(activated: boolean): void;
//     SetChanneling(channeling: boolean): void;
//     SetCurrentAbilityCharges(charges: number): void;
   
//     SetHidden(hidden: boolean): void;
//     SetInAbilityPhase(inAbilityPhase: boolean): void;
//     SetFrozenCooldown(frozenCooldown: boolean): void;
//     /**
//      * Sets the level of this ability.
//      */
//     SetLevel(level: number): void;
//     SetOverrideCastPoint(castPoint: number): void;
//     SetRefCountsModifiers(refCounts: boolean): void;
//     SetStealable(stealable: boolean): void;
//     SetStolen(stolen: boolean): void;
//     SetUpgradeRecommended(upgradeRecommended: boolean): void;
//     ShouldUseResources(): boolean;
//     SpeakAbilityConcept(concept: number): void;
//     SpeakTrigger(): unknown;
//     StartCooldown(cooldown: number): void;
//     ToggleAbility(): void;
//     ToggleAutoCast(): void;
//     UpgradeAbility(supressSpeech: boolean): void;
//     UseResources(mana: boolean, useHealth: boolean, gold: boolean, cooldown: boolean): void;
//     __kind__: 'instance';
// }