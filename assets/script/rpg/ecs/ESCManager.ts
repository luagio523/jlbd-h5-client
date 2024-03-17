

/**
 * ECS 实现
 */

import { ECSComponents } from "./ECSComponents";
import { ECSEntities } from "./ECSEntities";
import { ECSSystems } from "./ECSSystems";



export class ECSManager  {
   
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

   

    /**
     * 构造函数
     */
    constructor() {
        this.systems =  new ECSSystems(this);
        this.entities =  new ECSEntities();
        this.components = this.entities.components;
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



    
}
