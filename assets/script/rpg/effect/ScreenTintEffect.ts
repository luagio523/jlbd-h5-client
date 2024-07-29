import { Node, Color, tween, UITransform } from 'cc';

import { BaseEffect } from './Effect';
import { Effect } from './__private';
import { RenderableManager } from '../manager/RenderableManager';
import { ScreenTint } from '../render/effect/ScreenTint';


@Effect('ScreenTintEffect')
export class ScreenTintEffect extends BaseEffect {
    private screenTint: ScreenTint | null = null;
    private renderableManager: RenderableManager;

    constructor() {
        super();
        this.renderableManager = RenderableManager.getInstance();
    }

    async apply(target: Node, color: Color, duration: number = 1): Promise<void> {
        const targetTransform = target.getComponent(UITransform);
        if (!targetTransform) {
            console.error('UITransform component not found on target node');
            return;
        }

        const width = targetTransform.width;
        const height = targetTransform.height;

        if (!this.screenTint) {
            this.screenTint = await this.renderableManager.createScreenTint(width, height);
        } else {
            this.screenTint.setSize(width, height);
        }

        this.screenTint.setColor(color);
        this.screenTint.setOpacity(0);
        target.addChild(this.screenTint.getNode());

        const uiOpacity = this.screenTint.getUIOpacity();

        // 创建淡入淡出的动画
        tween(uiOpacity)
            .to(duration * 0.5, { opacity: 255 })
            .to(duration * 0.5, { opacity: 0 })
            .call(() => {
                this.reset();
                this.complete();
            })
            .start();
    }

    reset(): void {
        if (this.screenTint) {
            this.screenTint.reset();
            this.renderableManager.recycleScreenTint(this.screenTint);
            this.screenTint = null;
        }
    }
}
