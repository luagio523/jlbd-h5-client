import { AbilityData } from "./AbilityData";

// OnAbilityPhaseStart(): boolean; 这个函数在英雄开始释放技能，也就是技能施法前摇的时候被调用。如果这个函数返回true，英雄会继续施法，然后OnSpellStart() 会被调用。如果返回false，英雄将取消施法，并且OnSpellStart() 不会被调用。
// 这两者的主要区别在于，OnSpellStart(): void; 是在技能成功释放后调用的，而 OnAbilityPhaseStart(): boolean; 是在技能开始施法的时候调用。所以这两者的主要区别在于它们影响技能何时启动，以及技能的效果何时产生。

class BaseAbility {
    private _abilityData:AbilityData


    GetAbilityIndex(): number;
    GetAbilityName(): string;

    GetLevel(): number;

    // StartCooldown(cooldown: number): void;
    // EndCooldown(): void;
    // ToggleAutoCast(): void;
    // SetFrozenCooldown(frozenCooldown: boolean): void; //冻结倒计时

    // OnAbilityPhaseInterrupted(): void;
    // OnAbilityPhaseStart(): boolean;
    // OnAbilityPinged(playerId: PlayerID, ctrlHeld: boolean): void;
    // OnChannelFinish(interrupted: boolean): void;
    // OnChannelThink(interval: number): void;
    // OnHeroCalculateStatBonus(): void;
    // OnHeroLevelUp(): void;
    // OnOwnerDied(): void;
    // OnOwnerSpawned(): void;
    // OnSpellStart(): void;
    // OnToggle(): void;
    // OnUpgrade(): void;

    // GetCursorPosition(): Vector;
    // GetCursorTarget(): CDOTA_BaseNPC | undefined;
    // GetCursorTargetingNothing(): boolean;

    EndChannel(interrupted: boolean): void;
}   





class BaseAbility2 extends CBaseEntity {
    CanAbilityBeUpgraded(): boolean;
    CastAbility(): boolean;
    ContinueCasting(): boolean;
    CreateVisibilityNode(location: Vector, radius: number, duration: number): void;
    DecrementModifierRefCount(): void;
    EnableAbilityChargesOnTalentUpgrade(ability: object, talentName: string): void;
    EndChannel(interrupted: boolean): void;
    /**
     * Clear the cooldown remaining on this ability.
     */
    EndCooldown(): void;
    ForceSetFrozenCooldown(value: number): void;
    GetAbilityChargeRestoreTime(level: number): number;
  
    /**
     * Gets the key values definition for this ability.
     */
    GetAbilityKeyValues(): object;
    /**
     * Returns the name of this ability.
     *
     * @both
     */
  
   GetBehaviorInt(): DOTA_ABILITY_BEHAVIOR;

    GetAnimationIgnoresModelScale(): boolean;
    GetAOERadius(): number;
    GetAssociatedPrimaryAbilities(): string;
    GetAssociatedSecondaryAbilities(): string;
    GetAutoCastState(): boolean;
    GetBackswingTime(): number;
    /**
  
    /**
     * Get the owner of this ability.
     *
     * @both
     */
    GetCaster(): CDOTA_BaseNPC;
   
    /** @both */
    GetCastPointModifier(): number;
    /**
     * Gets the cast range of the ability.
     */
    GetCastRange(location: Vector | undefined, target: CDOTA_BaseNPC | undefined): number;
    GetChannelledHealthCostPerSecond(level: number): number;
    GetChannelledManaCostPerSecond(level: number): number;
    GetChannelStartTime(): number;
    GetChannelTime(): number;
    GetCloneSource(): CDOTA_BaseNPC | undefined;
    GetConceptRecipientType(): number;
    /**
     * Get the cooldown duration for this ability at a given level, not the amount of
     * cooldown actually left.
     */
    GetCooldown(level: number): number;
    GetCooldownTime(): number;
    GetCooldownTimeRemaining(): number;
    /**
     * The number of charges remaining on this ability.
     *
     * @both
     */
    GetCurrentAbilityCharges(): number;
    GetCursorPosition(): Vector;
    GetCursorTarget(): CDOTA_BaseNPC | undefined;
    GetCursorTargetingNothing(): boolean;
    GetDuration(): number;
    /**
     * Gets the cast range of the ability, taking modifiers into account.
     */
    GetEffectiveCastRange(location: Vector, target: object): number;
    GetEffectiveCooldown(level: number): number;
    GetEffectiveHealthCost(level: number): number;
    GetEffectiveManaCost(level: number): number;
    GetGoldCost(level: number): number;
    GetGoldCostForUpgrade(level: number): number;
    GetHealthCost(level: number): number;
    GetHeroLevelRequiredToUpgrade(): number;
    GetInitialAbilityCharges(level: number): number;
    GetIntrinsicModifierName(): string;
    /**
     * Get the current level of the ability.
     *
     * @both
     */
    GetLevel(): number;
    /**
     * Gets a value from this ability's special value block for passed level.
     *
     * @both
     */
    GetLevelSpecialValueFor(name: string, level: number): number;
    /**
     * Gets a value from this ability's special value block for passed level, ignoring
     * MODIFIER_PROPERTY_OVERRIDE_ABILITY_SPECIAL.
     *
     * @both
     */
    GetLevelSpecialValueNoOverride(name: string, level: number): number;
    GetManaCost(level: number): number;
    GetMaxAbilityCharges(level: number): number;
    GetMaxLevel(): number;
    GetModifierValue(): number;
    GetModifierValueBonus(): number;
    GetPlaybackRateOverride(): number;
    GetSharedCooldownName(): string;
    /**
     * Gets a value from this ability's special value block for its current level.
     *
     * @both
     */
    GetSpecialValueFor(name: string): number;
    GetStolenActivityModifier(): string;
    /**
     * Whether or not this ability is toggled.
     *
     * @both
     */
    GetToggleState(): boolean;
    GetUpgradeRecommended(): boolean;
    HeroXPChange(xp: number): boolean;
    IncrementModifierRefCount(): void;
    IsActivated(): boolean;
    IsAttributeBonus(): boolean;
    /**
     * Returns whether the ability is currently channeling.
     */
    IsChanneling(): boolean;
    IsCooldownReady(): boolean;
    IsCosmetic(entity: CBaseEntity): boolean;
    /**
     * Returns whether the ability can be cast.
     */
    IsFullyCastable(): boolean;
    IsHidden(): boolean;
    IsHiddenAsSecondaryAbility(): boolean;
    IsHiddenWhenStolen(): boolean;
    /**
     * Returns whether the ability is currently casting.
     */
    IsInAbilityPhase(): boolean;
    /**
     * Whether or not this ability is an item.
     *
     * @both
     */
    IsItem(): this is CDOTA_Item;
    IsOwnersGoldEnough(issuerPlayerId: PlayerID): boolean;
    IsOwnersGoldEnoughForUpgrade(): boolean;
    IsOwnersManaEnough(): boolean;
    IsPassive(): boolean;
    IsRefreshable(): boolean;
    IsSharedWithTeammates(): boolean;
    IsStealable(): boolean;
    IsStolen(): boolean;
    IsToggle(): boolean;
    IsTrained(): boolean;
    /**
     * Mark the ability button for this ability as needing a refresh.
     */
    MarkAbilityButtonDirty(): void;
    NumModifiersUsingAbility(): number;
    OnAbilityPhaseInterrupted(): void;
    
    OnAbilityPinged(playerId: PlayerID, ctrlHeld: boolean): void;
    OnChannelFinish(interrupted: boolean): void;
    OnChannelThink(interval: number): void;
    OnHeroCalculateStatBonus(): void;
    OnHeroLevelUp(): void;
    OnOwnerDied(): void;
    OnOwnerSpawned(): void;
    OnSpellStart(): void;
    OnAbilityPhaseStart(): boolean;
    OnToggle(): void;
    OnUpgrade(): void;


    PayGoldCost(): void;
    PayGoldCostForUpgrade(): void;
    PayHealthCost(): void;
    PayManaCost(): void;
    PlaysDefaultAnimWhenStolen(): boolean;
    ProcsMagicStick(): boolean;
    RefCountsModifiers(): boolean;
    RefreshCharges(): void;
    RefreshIntrinsicModifier(): void;
    RefundHealthCost(): void;
    RefundManaCost(): void;
    RequiresFacing(): boolean;
    ResetToggleOnRespawn(): boolean;
    SetAbilityIndex(index: number): void;
    SetActivated(activated: boolean): void;
    SetChanneling(channeling: boolean): void;
    SetCurrentAbilityCharges(charges: number): void;
   
    SetHidden(hidden: boolean): void;
    SetInAbilityPhase(inAbilityPhase: boolean): void;
    SetFrozenCooldown(frozenCooldown: boolean): void;
    /**
     * Sets the level of this ability.
     */
    SetLevel(level: number): void;
    SetOverrideCastPoint(castPoint: number): void;
    SetRefCountsModifiers(refCounts: boolean): void;
    SetStealable(stealable: boolean): void;
    SetStolen(stolen: boolean): void;
    SetUpgradeRecommended(upgradeRecommended: boolean): void;
    ShouldUseResources(): boolean;
    SpeakAbilityConcept(concept: number): void;
    SpeakTrigger(): unknown;
    StartCooldown(cooldown: number): void;
    ToggleAbility(): void;
    ToggleAutoCast(): void;
    UpgradeAbility(supressSpeech: boolean): void;
    UseResources(mana: boolean, useHealth: boolean, gold: boolean, cooldown: boolean): void;
    __kind__: 'instance';
}