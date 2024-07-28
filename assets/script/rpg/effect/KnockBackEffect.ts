// KnockbackEffect.ts
import { Node, Vec3, tween } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';


@Effect('KnockBackEffect')
export class KnockBackEffect extends BaseEffect {
    
    apply(target: Node, direction: Vec3, distance: number, duration: number): void {
        const knockbackVector = direction.normalize().multiplyScalar(distance);
        const targetPosition = target.position.clone().add(knockbackVector);

        tween(target)
            .to(duration, { position: targetPosition })
            .call(() => this.complete())
            .start();
    }


    reset(): void {
    }
}