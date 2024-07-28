

//怪物追踪，利用rvo移动，检测格子阻挡。如果A被阻挡，A找寻A*寻路。 顺便找到附近的符合条件怪物，加入移动群组，A作为群组领导。

import { AnimResourceType } from "../../core/animation/Type";
import { ActionOptions } from "../base/ActAnimationState";
import { RenderableComponent } from "../component/RenderableComponent";
import { HeroData } from "../data/HeroData";
import { ECSEntity } from "../ecs/ECSEntity";
import GameEntity from "../entity/Entity";
import { ActType } from "../enum/Act";
import { EntityType } from "../enum/Type";
import EntityFactory from "../factory/EntityFactory";
import { CharacterRenderer } from "../render/character/CharacterRenderer";
import { KVManager } from "./KVManager";
import { RenderableManager } from "./RenderableManager";
import { SceneManager } from "./SceneManager";





export class EntityManager {

    private static instance: EntityManager;
    private selectedEntity: ECSEntity | null = null;
    private playerControlledEntity: ECSEntity | null = null;

    private entityFactory: EntityFactory = EntityFactory.getInstance();
    private renderableManager:RenderableManager = RenderableManager.getInstance();
    private sceneManager:SceneManager = SceneManager.getInstance();
    private constructor() {}

    public static getInstance(): EntityManager {
        if (!EntityManager.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    }


    public async addEntity(name: string): Promise<void> {
        const entity = this.entityFactory.createEntity(EntityType.Role);
        // const kvData = KVManager.getInstance().getKVData(name);
        // const heroData = new HeroData()
        // heroData.deserialize(kvData); 
        let render = entity.getComponent(RenderableComponent);
        let resourceType = AnimResourceType.SpriteAltas;
        let characterRenderer = await this.renderableManager.createCharacterRender(resourceType);
        render.initialize(characterRenderer);

        const actionOptions: ActionOptions = {
            modelName: 'Thief',
            action: ActType.ACT_WALK,
         
        };
        characterRenderer.playAction(actionOptions);

        this.sceneManager.addEntity(entity); // 加入场景
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