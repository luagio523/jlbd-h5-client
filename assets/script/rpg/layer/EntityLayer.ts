import { _decorator, Component, Node, Vec3 } from 'cc';
import { Timer } from '../../core/common/timer/Timer';
import { RenderableComponent } from '../component/UnitRenderComponent';
import { ECSEntity } from '../ecs/ECSEntity';
const { ccclass, property } = _decorator;

@ccclass('EntityLayer')
export class EntityLayer extends Node {
    @property
    updateInterval: number = 0.1; // 更新间隔，单位：秒

    private timer: Timer;

    onLoad() {
        this.timer = new Timer(this.updateInterval, this.sortEntities.bind(this));
    }

    addEntity(entity: ECSEntity): void {
        const renderable = entity.getComponent(RenderableComponent);
        if (renderable) {
            this.addChild(renderable.getNode());    
        }
    }

    removeEntity(entity: ECSEntity): void {
        const renderable = entity.getComponent(RenderableComponent);
        if (renderable) {
           this.removeChild(renderable.getNode());
        }
    }

    private sortEntities(): void {
       this.children.sort((a, b) => b.position.y - a.position.y);
    }

    update(dt: number): void {
        this.timer.update(dt);
    }

    // 手动触发更新
    forceUpdate(): void {
        this.sortEntities();
        this.timer.restart(false);
    }
}
