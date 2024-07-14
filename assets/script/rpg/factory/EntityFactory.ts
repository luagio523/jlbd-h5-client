import { ECSEntity } from "../ecs/ECSEntity";

export default class EntityFactory {
    private static instance: EntityFactory;
    private entityPool: ECSEntity[] = [];
  
    private constructor() {}
  
    static getInstance(): EntityFactory {
      if (!EntityFactory.instance) {
        EntityFactory.instance = new EntityFactory();
      }
      return EntityFactory.instance;
    }
  
    createEntity(): ECSEntity {
      if (this.entityPool.length > 0) {
        return this.entityPool.pop()!;
      } else {
        return new ECSEntity();
      }
    }
  
    recycleEntity(entity: ECSEntity): void {
    //   entity.reset();
      this.entityPool.push(entity);
    }
}