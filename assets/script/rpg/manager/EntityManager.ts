

//怪物追踪，利用rvo移动，检测格子阻挡。如果A被阻挡，A找寻A*寻路。 顺便找到附近的符合条件怪物，加入移动群组，A作为群组领导。

import { AnimResourceType } from "../../core/animation/Type";
import { ActionOptions } from "../base/UnitAnimationState";
import { MovableComponent } from "../component/MovableComponent";
import {  UnitRenderComponent } from "../component/UnitRenderComponent";
import { EntityData } from "../data/EntityData";
import { HeroKV } from "../data/kv/HeroKV";
import { ECSEntity } from "../ecs/ECSEntity";
import GameEntity from "../entity/Entity";
import EntityFactory from "../factory/EntityFactory";
import { KVManager } from "./KVManager";
import { RenderableManager } from "./RenderableManager";





export class EntityManager {

    private static instance: EntityManager;
    private selectedEntity: ECSEntity | null = null;
    private playerControlledEntity: ECSEntity | null = null;

    private entityFactory: EntityFactory = EntityFactory.getInstance();
    private renderableManager:RenderableManager = RenderableManager.getInstance();
    private constructor() {}

    public static getInstance(): EntityManager {
        if (!EntityManager.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    }


    public async createEntity(data: EntityData): Promise<ECSEntity> {
        const kvData = await KVManager.getInstance().getHero(data.name);
        console.log("createEntity",kvData);
        const herokv = new HeroKV()
        herokv.deserialize(kvData); 
       
        console.log("createEntity",herokv);

        const entity = this.entityFactory.createEntity(data.type);
        let render = entity.getComponent(UnitRenderComponent);
        let unitRenderer = await this.renderableManager.createCharacter(herokv.GetModelType()  as AnimResourceType);
        render.initialize(unitRenderer,herokv.GetModel(),herokv.GetHeroName(),herokv.GetGender(),herokv.GetFrameRate());

        let movable = entity.getComponent(MovableComponent);
        movable.initialize(herokv.GetBaseMoveSpeed());

        this.setPlayerControlledEntity(entity);

        return entity;
    }
    
    removeEntity(entity: GameEntity): void {
        // this.entities.delete(entity);
        this.entityFactory.recycleEntity(entity);
    }


    // 现有的查询方法...

    // public getNearbyEntities(entity: ECSEntity, radius: number): ECSEntity[] {
    //     const center = entity.getComponent(TransformComponent).position;
    //     return this.queryEntitiesInCircle(center, radius);
    // }

    public setSelectedEntity(hero: ECSEntity | null): void {
        this.selectedEntity = hero;
    }

    public getSelectedEntity(): ECSEntity | null {
        return this.selectedEntity;
    }

    public setPlayerControlledEntity(hero: ECSEntity | null): void {
        this.playerControlledEntity = hero;
    }

    public getPlayerControlledEntity(): ECSEntity | null {
        return this.playerControlledEntity;
    }



    
}