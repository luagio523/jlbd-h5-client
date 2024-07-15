import { _decorator, Component, Node, Camera, Vec3, math, Tween } from 'cc';
const { ccclass, property } = _decorator;
const { clamp } = math;

/**
 * 跟踪目标的辅助类
 */
export class TrackLookAt {
    private fixedDeltaTime: number; // 固定的时间步长
    private accumulatedTime: number = 0; // 时间累积器

    protected target: Node;
    protected lastPosition: Vec3;
    protected syncViewWithTarget: (callback: Function) => Tween<Node>;
    protected isTweening: boolean;
    protected tween: Tween<Node>;

    public constructor(fixedDeltaTime: number = 0.2) {
        this.fixedDeltaTime = fixedDeltaTime;
    }

    /**
     * 更新跟踪逻辑
     * @param dt 时间增量
     */
    public update(dt: number) {
        if (!this.target) return;
        if (this.isTweening) return;
        this.accumulatedTime += dt;
        if (this.accumulatedTime < this.fixedDeltaTime) {
            return;
        }
        this.accumulatedTime = 0;
        if (!this.lastPosition.equals(this.target.position)) {
            this.syncOnce();
        }
    }

    /**
     * 执行一次同步
     */
    private syncOnce() {
        this.isTweening = true;
        this.tween = this.syncViewWithTarget(() => {
            this.isTweening = false;
        });
    }

    /**
     * 设置跟踪目标
     * @param target 目标节点
     * @param sync 同步函数
     */
    public lookAt(target: Node, sync: (callback: Function) => Tween<Node>) {
        this.target = target;
        this.lastPosition = Vec3.ZERO;
        this.syncViewWithTarget = sync;
        this.syncOnce(); // 直接触发一次
    }
}