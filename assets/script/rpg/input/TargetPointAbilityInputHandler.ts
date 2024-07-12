import { Vec2 } from "cc";
import { AbilityInputHandler } from "./AbilityInputHandler";


export class PointTargetAbilityInputHandler extends AbilityInputHandler {
    private startPosition: Vec2 | null = null;
    private currentPosition: Vec2 | null = null;

    handleInput(eventType: string, event: any): boolean {
        switch (eventType) {
            case 'touchstart':
            case 'mousedown':
                if (this.ability.CanBeExecuted()) {
                    this.startPosition = this.getInputPosition(event);
                    this.showRangeIndicator(this.startPosition);
                }
                return false;

            case 'touchmove':
            case 'mousemove':
                if (this.rangeIndicator && this.startPosition) {
                    this.currentPosition = this.getInputPosition(event);
                    this.updateRangeIndicator(this.currentPosition);
                }
                return false;

            case 'touchend':
            case 'mouseup':
                if (this.rangeIndicator && this.startPosition && this.currentPosition) {
                    this.hideRangeIndicator();
                    
                    // 检查是否在施法范围内
                    const castRange = this.ability.GetCastRange();
                    const distance = Vec2.distance(this.startPosition, this.currentPosition);
                    
                    this.startPosition = null;
                    return distance <= castRange;
                }
                this.startPosition = null;
                this.currentPosition = null;
                return false;

            default:
                return false;
        }
    }

    public getCurrentTarget(): Vec2 | null {
        return this.currentPosition;
    }
}