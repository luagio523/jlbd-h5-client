import { Vec2 } from "cc";
import { BaseAbility } from "../ability/BaseAbility";
import { AbilityBehavior } from "../enum/Type";
import { RangeIndicator } from "./RangeIndicator";

export abstract class AbilityIndicator {
    protected ability: BaseAbility;
    protected rangeIndicator: RangeIndicator | null = null;
    public onCancel: () => void = () => {};
    public onConfirm: () => void = () => {};

    constructor(ability: BaseAbility) {
        this.ability = ability;
    }

    public start(): void {
        this.showRangeIndicator(this.getInputPosition());
    }

   

    public cancel(): void {
        this.hideRangeIndicator();
        this.onCancel();
    }

    public confirm(): void {
        this.onConfirm();
    }

    abstract handleInput(eventType: string, event: any): boolean;

    protected showRangeIndicator(position: Vec2): void {
        if (this.ability.GetBehavior() & AbilityBehavior.ABILITY_BEHAVIOR_AOE) {
            const aoeRadius = this.ability.GetAOERadius();
            this.rangeIndicator = new RangeIndicator(position, this.ability.GetCastRange(), aoeRadius);
        } else {
            this.rangeIndicator = new RangeIndicator(position, this.ability.GetCastRange());
        }
        this.rangeIndicator.show();
    }

    protected updateRangeIndicator(position: Vec2): void {
        if (this.rangeIndicator) {
            this.rangeIndicator.updatePosition(position);
        }
    }

    protected hideRangeIndicator(): void {
        if (this.rangeIndicator) {
            this.rangeIndicator.hide();
            this.rangeIndicator = null;
        }
    }

    protected getInputPosition(event?: any): Vec2 {
        // 实现获取输入位置的逻辑
        if (event instanceof TouchEvent) {
            const touch = event.touches[0] || event.changedTouches[0];
            return new Vec2(touch.clientX, touch.clientY);
        } else if (event instanceof MouseEvent) {
            return new Vec2(event.clientX, event.clientY);
        }
        return new Vec2(0, 0); // 默认返回值
    }

    public getAbility(): BaseAbility {
        return this.ability;
    }
}

export class UnitTargetAbilityIndicator extends AbilityIndicator {
    // 实现单位目标技能的输入处理
    handleInput(eventType: string, event: TouchEvent):boolean{return true }

}

export class NoTargetAbilityIndicator extends AbilityIndicator {
    // 实现无目标技能的输入处理
    handleInput(eventType: string, event: TouchEvent):boolean{return true }
}

export class ToggleAbilityIndicator extends AbilityIndicator {
    // 实现切换技能的输入处理
    handleInput(eventType: string, event: TouchEvent):boolean{return true }
}

export class PassiveAbilityIndicator extends AbilityIndicator {
    // 实现被动技能的输入处理（通常不需要输入）
    handleInput(eventType: string, event: TouchEvent):boolean{return true }
}

export class DefaultAbilityIndicator extends AbilityIndicator {
    // 默认的输入处理
    handleInput(eventType: string, event: TouchEvent):boolean{return true }
}