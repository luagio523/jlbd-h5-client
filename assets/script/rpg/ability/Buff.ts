import { ModifierAttribute } from "../enum/Modifier";
import { Modifier } from "./Modifier";


export abstract class Buff extends Modifier {
    constructor(
        id: string,
        duration: number = Infinity,
        isHidden: boolean = false,
        isDebuff: boolean = false,
        purgable: boolean = true,
        priority: number = 0,
        attribute: ModifierAttribute = ModifierAttribute.MODIFIER_ATTRIBUTE_NONE
    ) {
        super(id, duration, isHidden, isDebuff, purgable, priority);
        this.attribute = attribute;
    }

    // 可以在这里添加 Buff 特有的方法和属性
    public getRemainingDuration(): number {
        return this.duration;
    }

    public refresh(): void {
        this.OnRefresh();
    }
}




// declare interface CDOTA_Buff {
//     /** @both */
//     AddParticle(
//         index: number,
//         destroyImmediately: boolean,
//         statusEffect: boolean,
//         priority: number,
//         heroEffect: boolean,
//         overheadEffect: boolean,
//     ): void;
//     /** @both */
//     CheckStateToTable(table: object): void;
//     /**
//      * Decrease this modifier's stack count by 1.
//      *
//      * @both
//      */
//     DecrementStackCount(): void;
//     /**
//      * Run all associated destroy functions, then remove the modifier.
//      *
//      * @both
//      */
//     Destroy(): void;
//     /** @both */
//     DestroyOnExpire(): boolean;
//     /**
//      * Run all associated refresh functions on this modifier as if it was re-applied.
//      *
//      * @both
//      */
//     ForceRefresh(): void;
//     /**
//      * Get the ability that generated the modifier.
//      *
//      * @both
//      */
//     GetAbility(): CDOTABaseAbility | undefined;
//     /**
//      * Returns aura stickiness (default 0.5).
//      *
//      * @both
//      */
//     GetAuraDuration(): number;
//     /**
//      * Returns the owner of the aura modifier, that applied this modifier. Always
//      * `nil` on the client.
//      *
//      * @both
//      */
//     GetAuraOwner(): CDOTA_BaseNPC | undefined;
//     /**
//      * Get the owner of the ability responsible for the modifier.
//      *
//      * @both
//      */
//     GetCaster(): CDOTA_BaseNPC | undefined;
//     /** @both */
//     GetClass(): string;
//     /** @both */
//     GetCreationTime(): number;
//     /** @both */
//     GetDieTime(): number;
//     /** @both */
//     GetDuration(): number;
//     /** @both */
//     GetElapsedTime(): number;
//     /** @both */
//     GetLastAppliedTime(): number;
//     /** @both */
//     GetName(): string;
//     /**
//      * Get the unit the modifier is parented to.
//      *
//      * @both
//      */
//     GetParent(): CDOTA_BaseNPC;
//     /** @both */
//     GetRemainingTime(): number;
//     /** @both */
//     GetSerialNumber(): number;
//     /** @both */
//     GetStackCount(): number;
//     /** @both */
//     HasFunction(func: modifierfunction): boolean;
//     /**
//      * Increase this modifier's stack count by 1.
//      *
//      * @both
//      */
//     IncrementStackCount(): void;
//     /** @both */
//     IsDebuff(): boolean;
//     /** @both */
//     IsHexDebuff(): boolean;
//     /** @both */
//     IsStunDebuff(): boolean;
//     SendBuffRefreshToClients(): void;
//     /** @both */
//     SetDuration(duration: number, informClient: boolean): void;
//     /** @both */
//     SetOverheadEffectOffset(offset: number): boolean;
//     /** @both */
//     SetStackCount(count: number): void;
//     /**
//      * Start this modifier's think function (OnIntervalThink) with the given interval
//      * (float).  To stop, call with -1.
//      *
//      * @both
//      */
//     StartIntervalThink(interval: number): void;
//     __kind__: 'instance';
// }