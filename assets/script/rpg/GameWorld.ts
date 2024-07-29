// GameWorld.js

import { _decorator, Component } from "cc";
import { EntityData, } from "./data/EntityData";
import { ECSManager } from "./ecs/ESCManager";
import { EntityManager } from "./manager/EntityManager";
import { SceneManager } from "./manager/SceneManager";
import { RenderableSystem } from "./system/RenderableSystem";
import { EventManager } from "./event/EventManager";
const { ccclass, property } = _decorator;

@ccclass('GameWorld')
export class GameWorld extends Component {
    private entityManager: EntityManager;
    private sceneManager: SceneManager;
    private eventManager: EventManager;
    private ecs: ECSManager;

    onLoad() {
        this.entityManager = EntityManager.getInstance();
        this.sceneManager = SceneManager.getInstance();
        this.ecs = ECSManager.getInstance();
        this.eventManager = EventManager.getInstance();

        this.initECS();
        this.initEvent();
    }

    start() {
        this.ecs.start();
    }

    stop() {
        this.ecs.stop();
    }

    private initECS(): void {
        // 将系统添加到 ECS 中
        
        this.sceneManager.initialize(this.node);
        this.ecs.systems
            .add(new RenderableSystem())
    }

    private initEvent(): void {
        this.eventManager.registerListener('createRole', this.createRole.bind(this))
    }

    public async createRole(data: EntityData): Promise<void> {
        // 创建主角
        const role = await this.entityManager.createEntity(data);
        // // 将主角添加到场景中
        this.sceneManager.addEntity(role);
    }


    update(dt: number) {
        this.ecs.update(dt);  // 持续更新 ECS 状态
    }
}

