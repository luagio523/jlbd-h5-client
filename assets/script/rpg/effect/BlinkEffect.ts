// BlinkEffect.ts
import { Node, Sprite, tween, Color } from 'cc';
import { Effect } from './__private';
import { BaseEffect } from './Effect';

@Effect('blink')
export class BlinkEffect extends BaseEffect {
   
    apply(target: Node, duration: number = 0.5, blinkCount: number = 3): void {
        const sprite = target.getComponent(Sprite);
        if (!sprite) {
            console.warn('BlinkEffect: Target node does not have a Sprite component');
            return;
        }

        const originalColor = sprite.color.clone();
        const blinkColor = new Color(255, 0, 0, 255); // 红色

        let currentBlink = 0;
        const blinkAction = tween(sprite)
            .to(duration / (blinkCount * 2), { color: blinkColor })
            .to(duration / (blinkCount * 2), { color: originalColor })
            .call(() => {
                currentBlink++;
                if (currentBlink >= blinkCount) {
                    this.complete();
                }
            });
        tween(sprite).repeat(blinkCount, blinkAction).start();
    }


    reset(): void {
        
    }
}
