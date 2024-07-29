// GameWorld.js

import { _decorator, Component, Node } from "cc";
import { EntityData, } from "./data/EntityData";
import { ECSManager } from "./ecs/ESCManager";
import { EntityManager } from "./manager/EntityManager";
import { SceneManager, SLayerType } from "./manager/SceneManager";
import { RenderableSystem } from "./system/RenderableSystem";
import { EventManager } from "./event/EventManager";
import { MapDisplay } from "./map/MapDisplay";
import MapManager from "./manager/MapManager";
import { RPGEvent } from "./event/Event";
const { ccclass, property } = _decorator;

export class GameWorld   {
    private entityManager: EntityManager;
    private sceneManager: SceneManager;
    private eventManager: EventManager;
    private mapManager: MapManager;
    private ecs: ECSManager;

    private rootNode!: Node;
    private cameraNode!: Node;
    private isInit:boolean = false 

    public constructor(rootNode: Node, cameraNode: Node) {
        this.rootNode = rootNode;
        this.cameraNode = cameraNode;
    }

    public initialize(): void {
        if(!this.isInit){
            this.entityManager = EntityManager.getInstance();
            this.sceneManager = SceneManager.getInstance();
            this.ecs = ECSManager.getInstance();
            this.eventManager = EventManager.getInstance();
            this.mapManager = MapManager.getInstance();
            this.initECS();
            this.initEvent();
            this.initScene();
            this.isInit = true
        }
    }

    start() {
        this.initialize();
        this.ecs.start();
    }

    stop() {
        this.ecs.stop();
    }

    private initECS(): void {
        // 将系统添加到 ECS 中
        this.ecs.systems
            .add(new RenderableSystem())
    }

    private initScene(): void {
        this.sceneManager.initialize(this.rootNode);
        this.mapManager.initialize(this.cameraNode);//初始化地图
    }

    private initEvent(): void {
        this.eventManager.registerListener('createRole', this.createRole.bind(this))

        this.eventManager.registerListener(RPGEvent.EnterMap, this.enterMap.bind(this))
    }

    private enterMap(data: any): void {
        const mapId = data.mapName;
        const lookAt = data.lookAt;
        this.mapManager.enterMap(mapId).then(() => {
            this.mapManager.setCameraFocus(lookAt);
        });
    }


    private async createRole(data: EntityData): Promise<void> {
        // 创建主角
        const role = await this.entityManager.createEntity(data);
        // // 将主角添加到场景中
        this.sceneManager.addEntity(role);

        // this.sceneManager.initialize(this.node);
    }


    update(dt: number) {
        if(!this.isInit) return 

        this.ecs.update(dt);  // 持续更新 ECS 状态
    }
}

