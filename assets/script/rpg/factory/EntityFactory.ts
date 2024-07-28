import GameEntity from "../entity/Entity";
import { EntityType } from "../enum/Type";
import { RenderableComponent } from "../component/RenderableComponent";


/**
 * 负责实体的创建、回收、添加组件等操作
 */
export default class EntityFactory {
	private static instance: EntityFactory;
	private entityPools: Map<EntityType, GameEntity[]> = new Map();

	private constructor() {
		// 初始化每种实体类型的对象池
		Object.values(EntityType).forEach(type => {
			this.entityPools.set(type as EntityType, []);
		});
	}

	static getInstance(): EntityFactory {
		if (!EntityFactory.instance) {
			EntityFactory.instance = new EntityFactory();
		}
		return EntityFactory.instance;
	}

	createEntity(type: EntityType = EntityType.Default): GameEntity {
		const pool = this.entityPools.get(type);
		if (pool && pool.length > 0) {
			return pool.pop()!;
		} else {
			const entity = new GameEntity();
			entity.setType(type);
			this.initializeEntity(entity, type);
			return entity;
		}
	}

	recycleEntity(entity: GameEntity): void {
		const type = entity.getType();
		entity.reset();
		const pool = this.entityPools.get(type);
		if (pool) {
			pool.push(entity);
		}
	}

	private initializeEntity(entity: GameEntity, type: EntityType): void {
		// 根据实体类型初始化特定的组件或属性
		switch (type) {
			case EntityType.Role:
				entity.addComponent(new RenderableComponent());
				break;
			case EntityType.Hero:
				entity.addComponent(new RenderableComponent());
				break;
			case EntityType.Creep:
				// 初始化小兵特有的组件
				break;
			case EntityType.Building:
				// 初始化建筑特有的组件
				break;
			case EntityType.Item:
				// 初始化物品特有的组件
				break;
			// 可以添加更多类型的初始化逻辑
		}
	}

}