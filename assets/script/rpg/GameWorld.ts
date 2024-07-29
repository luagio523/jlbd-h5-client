// GameWorld.js

import { EntityData,  } from "./data/EntityData";
import { EntityManager } from "./manager/EntityManager";
import { SceneManager } from "./manager/SceneManager";





export class GameWorld {
    private entityManager: EntityManager;
    private sceneManager: SceneManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.sceneManager = SceneManager.getInstance();
    }

    public initialize(): void {

    }

    public async createRole(data: EntityData): Promise<void> {
        // 创建主角
        const role = await this.entityManager.createEntity(data);
        // // 将主角添加到场景中
        // this.sceneManager.addEntity(data);
    }

}

