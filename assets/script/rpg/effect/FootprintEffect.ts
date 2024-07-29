import { Node, UIOpacity, Vec3, tween } from 'cc';
import { BaseEffect } from './Effect';
import { Effect } from './__private';
import { RenderableManager } from '../manager/RenderableManager';
import { Footprint } from '../render/unit/Footprint';
import { AudioManager } from '../../core/common/audio/AudioManager';
import scheduler from '../../utils/scheduler';

@Effect('FootprintEffect')
export class FootprintEffect extends BaseEffect {
    private footprints: Footprint[] = [];
    private renderableManager: RenderableManager;
    private audioManager: AudioManager;
    private interval: number;
    private duration: number;
    private maxFootprints: number;
    private moveDirection: Vec3 | null = null;
    private timer: number = -1;

    constructor() {
        super();
        this.audioManager = AudioManager.getInstance();
        this.renderableManager = RenderableManager.getInstance();
        this.interval = 0.5; // 每隔0.5秒生成一个足迹
        this.duration = 2; // 足迹持续2秒
        this.maxFootprints = 10; // 最多同时存在10个足迹
    }

    apply(target: Node, moveDirection: Vec3): void {
        this.updateDirection(moveDirection);
        if (this.timer == -1) {
            this.timer = scheduler.scheduleGlobal(this.createFootprint.bind(this, target), this.interval);
        }
    }

    updateDirection(moveDirection: Vec3): void {
        this.moveDirection = moveDirection.normalize();
    }

    private async createFootprint(target: Node): Promise<void> {
        if (!this.moveDirection) return;

        const footprint = await this.renderableManager.createFootprint();
        this.footprints.push(footprint);

        // 设置足迹位置和旋转
        const position = target.getPosition();
        footprint.setPosition(position.x, position.y, position.z);

        // 根据移动方向设置足迹的旋转
        const angle = Math.atan2(this.moveDirection.y, this.moveDirection.x) * 180 / Math.PI;
        footprint.getNode().angle = angle;

        target.parent.addChild(footprint.getNode());
        this.audioManager.playSFX('walk');


        // 确保节点有 UIOpacity 组件
        let uiOpacity = footprint.getNode().getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = footprint.getNode().addComponent(UIOpacity);
        }

        // 创建淡出动画
        tween(uiOpacity)
            .delay(this.duration * 0.5) // 延迟一半时间开始淡出
            .to(this.duration * 0.5, { opacity: 0 })
            .call(() => {
                this.recycleFootprint(footprint);
            })
            .start();

        // 如果足迹数量超过最大值，移除最早的足迹
        if (this.footprints.length > this.maxFootprints) {
            const oldestFootprint = this.footprints.shift();
            if (oldestFootprint) {
                this.recycleFootprint(oldestFootprint);
            }
        }
    }

    private recycleFootprint(footprint: Footprint): void {
        const index = this.footprints.indexOf(footprint);
        if (index !== -1) {
            this.footprints.splice(index, 1);
        }
        this.renderableManager.recycleFootprint(footprint);
    }

    reset(): void {
        if (this.timer !== -1) {
            scheduler.unscheduleGlobal(this.timer);
            this.timer = -1;
        }
        this.footprints.forEach(footprint => this.recycleFootprint(footprint));
        this.footprints = [];
        this.moveDirection = null;
    }

    update(dt: number): void {
        super.update(dt); // 调用基类的 update 方法来处理调度任务
    }
}
