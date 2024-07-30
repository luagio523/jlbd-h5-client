// GameWorld.js

import { _decorator, Component, Node, RenderableComponent } from "cc";
import { EntityData, } from "./data/EntityData";
import { ECSManager } from "./ecs/ESCManager";
import { EntityManager } from "./manager/EntityManager";
import { SceneManager, SLayerType } from "./manager/SceneManager";
import { RenderableSystem } from "./system/RenderableSystem";
import { EventManager } from "./event/EventManager";
import { MapDisplay } from "./map/MapDisplay";
import MapManager from "./manager/MapManager";
import { EnterMapEvent, InitRoleEvent, RPGEvent } from "./event/Event";
import { EntityType } from "./enum/Type";
import { UnitRenderComponent } from "./component/UnitRenderComponent";
import { ActionOptions } from "./base/UnitAnimationState";
import { ActType } from "./enum/Act";
import app from "../App";
import { Joystick } from "../modules/game/Joystick";
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

    start() {
        if(!this.isInit){
            this.initialize();
        }
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
        this.eventManager.registerListener(RPGEvent.InitRoleEvent, this.initRole.bind(this))
        this.eventManager.registerListener(RPGEvent.EnterMap, this.enterMap.bind(this))
    }


    private enterMap(data: EnterMapEvent): void {
        const mapId = data.mapId;
        const focus = data.focus;
        this.mapManager.enterMap(mapId).then(() => {
            this.mapManager.setCameraFocus(focus);
        });
    }


    private async initRole(evt: InitRoleEvent): Promise<void> {
        const data = EntityData.create( evt.name,evt.id, EntityType.Role);
        const role = await this.entityManager.createEntity(data); // 创建角色实体
        this.entityManager.setPlayerControlledEntity(role);  // 设置玩家控制的实体
        this.ecs.entities.add(role);  // 将角色实体添加到 ECS 中
        this.sceneManager.addEntity(role);  // 将角色实体添加到场景中

        let uint = role.getComponent(UnitRenderComponent).unit;
        uint.setPosition(400, 400);
        
        // this.sceneManager.initialize(this.node);
        const actionOptions: ActionOptions = {
            modelName: 'Thief',
            action: ActType.ACT_WALK,
        };
        uint.playAction(actionOptions);
    }


    update(dt: number) {
        if(!this.isInit) return 
        this.ecs.update(dt);  // 持续更新 ECS 状态
    }
}

