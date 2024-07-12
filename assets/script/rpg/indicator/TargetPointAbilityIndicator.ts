import { Vec2 } from "cc";
import { AbilityIndicator } from "./AbilityIndicator";


export class PointTargetAbilityIndicator extends AbilityIndicator {
    private startPosition: Vec2 | null = null;
    private currentPosition: Vec2 | null = null;

    handleInput(eventType: string, event: any): boolean {
        switch (eventType) {
            case 'touchstart':
            case 'mousedown':
                if (this.ability.CanBeExecuted()) {
                    this.startPosition = this.getInputPosition(event);
                    this.start()
                }else{
                    this.cancel();
                }

            case 'touchmove':
            case 'mousemove':
                if (this.rangeIndicator && this.startPosition) {
                    this.currentPosition = this.getInputPosition(event);
                    this.updateRangeIndicator(this.currentPosition);
                    return true;
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
                    this.currentPosition = null;
                    if (distance <= castRange){
                        this.confirm();
                    }else{
                        this.cancel();
                    }
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