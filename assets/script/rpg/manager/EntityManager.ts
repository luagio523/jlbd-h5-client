

//怪物追踪，利用rvo移动，检测格子阻挡。如果A被阻挡，A找寻A*寻路。 顺便找到附近的符合条件怪物，加入移动群组，A作为群组领导。

import { AnimResourceType } from "../../core/animation/Type";
import { ActionOptions } from "../base/UnitAnimationState";
import { MovableComponent } from "../component/MovableComponent";
import { NPCInteractiveComponent } from "../component/NPCInteractiveComponent";
import { TransformComponent } from "../component/TransformComponent";
import {  UnitRenderComponent } from "../component/UnitRenderComponent";
import { EntityData } from "../data/EntityData";
import { HeroKV } from "../data/kv/HeroKV";
import { ECSEntity } from "../ecs/ECSEntity";
import EntityFactory from "../factory/EntityFactory";
import { KVManager } from "./KVManager";
import { InteractionManager } from "./InteractionManager";
import { RenderableManager } from "./RenderableManager";





export class EntityManager {

    private static instance: EntityManager;
    private selectedEntity: ECSEntity | null = null;
    private playerControlledEntity: ECSEntity | null = null;

    private entityFactory: EntityFactory = EntityFactory.getInstance();
    private renderableManager:RenderableManager = RenderableManager.getInstance();
    private interactionManager:InteractionManager = InteractionManager.getInstance();
    private constructor() {}

    public static getInstance(): EntityManager {
        if (!EntityManager.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    }


    public async createEntity(data: EntityData): Promise<ECSEntity> {
        const kvData = await KVManager.getInstance().getHero(data.name);
        const herokv = new HeroKV()
        herokv.deserialize(kvData); 
       
        const entity = this.entityFactory.getEntity(data.type);
        let render = entity.getComponent(UnitRenderComponent);
        let unitRenderer = await this.renderableManager.createCharacter(herokv.GetModelType()  as AnimResourceType);
        render.initialize(unitRenderer,herokv.GetModel(),herokv.GetHeroName(),herokv.GetGender(),herokv.GetFrameRate());

        let transform = entity.getComponent(TransformComponent);
        transform.setPosition(data.pos)

        let movable = entity.getComponent(MovableComponent);
        movable.initialize(herokv.GetBaseMoveSpeed());

        

        return entity;
    }


    public async createNPC(data: EntityData): Promise<ECSEntity> {

        const kvData = await KVManager.getInstance().getHero(data.name);
        const herokv = new HeroKV()
        herokv.deserialize(kvData); 
       
        const entity = this.entityFactory.getEntity(data.type);
        let render = entity.getComponent(UnitRenderComponent);
        let unitRenderer = await this.renderableManager.createCharacter(herokv.GetModelType()  as AnimResourceType);
        render.initialize(unitRenderer,herokv.GetModel(),herokv.GetHeroName(),herokv.GetGender(),herokv.GetFrameRate());


        let transform = entity.getComponent(TransformComponent);
        transform.setPosition(data.pos)


        let movable = entity.getComponent(MovableComponent);
        movable.initialize(herokv.GetBaseMoveSpeed());

        let interaction = entity.getComponent(NPCInteractiveComponent);

        let npcInteractions = await this.interactionManager.getNPCInteractions(herokv.GetHeroName())
        interaction.initialize(npcInteractions);

        return entity;
    }
    
    removeEntity(entity: ECSEntity): void {
        // this.entities.delete(entity);
        this.entityFactory.recycleEntity(entity);
    }



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