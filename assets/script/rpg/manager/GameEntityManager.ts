

//怪物追踪，利用rvo移动，检测格子阻挡。如果A被阻挡，A找寻A*寻路。 顺便找到附近的符合条件怪物，加入移动群组，A作为群组领导。

import { HeroData } from "../data/HeroData";
import { ECSEntity } from "../ecs/ECSEntity";
import GameEntity from "../entity/Entity";
import { EntityType } from "../enum/Type";
import EntityFactory from "../factory/EntityFactory";
import KVFileManager from "./KVFileManager";





export class GameEntityManager {

    private static instance: GameEntityManager;
    private selectedEntity: ECSEntity | null = null;
    private playerControlledEntity: ECSEntity | null = null;

    private entityFactory: EntityFactory = EntityFactory.getInstance();

    private constructor() {}

    public static getInstance(): GameEntityManager {
        if (!GameEntityManager.instance) {
            GameEntityManager.instance = new GameEntityManager();
        }
        return GameEntityManager.instance;
    }


    addEntity(name: string): void {
        const heroEntity = this.entityFactory.createEntity(EntityType.Hero);
        const kvData = KVFileManager.getInstance().getKVData(name);
        const heroData = new HeroData()
        heroData.deserialize(kvData); 
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