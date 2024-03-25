

/**
 * ECS 实现
 */

import { LinkListTimerMgr } from "../../core/common/timer/TimerMgr";
import { ECSComponents } from "./ECSComponents";
import { ECSEntities } from "./ECSEntities";
import { ECSSystems } from "./ECSSystems";



export class ECSManager {

    /**
     * 所有系统
     */
    readonly systems: ECSSystems;

    /**
     * 所有实体
     */
    readonly entities: ECSEntities;

    /**
     * 所有组件
     */
    readonly components: ECSComponents;

    readonly timerMgr:LinkListTimerMgr

    /**
     * 构造函数
     */
    constructor(updateInterval:number = 1/60) {
        this.systems = new ECSSystems(this);
        this.entities = new ECSEntities();
        this.components = this.entities.components;


        this.updateInterval = updateInterval;
        this.accumulatedTime = 0;
    }

    /**
     * 启动所有系统
     */
    start(): void {
        this.systems.start();
    }

    /**
     * 停止所有系统
     */
    stop(): void {
        this.systems.stop();
    }

    /** 
     * @param dt
     */
    update(dt: number): void {
        this.systems.update(dt);
    }



    /**
    * 更新的周期，例如如果希望每秒更新60次，则为1/60
    */
    readonly updateInterval: number;

    /**
     * 累积时间
     */
    private accumulatedTime: number;


    /**
     * 更新系统
     * @param dt 当前时间和上次更新时间的间隔
     */
    updateFix(dt: number): void {
        // 更新累积时间
        this.accumulatedTime += dt;

        // 如果累积时间已经大于或等于更新周期，则更新系统并减去相应的累积时间
        while (this.accumulatedTime >= this.updateInterval) {
            this.systems.update(this.updateInterval);
            this.accumulatedTime -= this.updateInterval;
        }
    }



}
