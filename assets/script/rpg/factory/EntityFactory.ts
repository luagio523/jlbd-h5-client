import { EntityType } from "../enum/Type";

import { ECSEntity } from "../ecs/ECSEntity";
import { ComponentFactory } from "./ComponentFactory";


// 创建一个对象来存储角色类型与所需组件的映射
const requiredComponents = {
    Role: [
        "TransformComponent",
        "MovableComponent",
        "InputComponent",
        "UnitRenderComponent"
    ],
    NPC: [
        "TransformComponent",
        "UnitRenderComponent",
        "NPCInteractiveComponent"
    ]
};

/**
 * 负责实体的创建、回收、添加组件等操作
 */
export default class EntityFactory {
	private static instance: EntityFactory;
	private entityPools: Map<EntityType, ECSEntity[]> = new Map();

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

	getEntity(type: EntityType = EntityType.Default): ECSEntity {
		const pool = this.entityPools.get(type);
		let entity: ECSEntity;
		if (pool && pool.length > 0) {
			entity =  pool.pop()!;
		} else {
			entity = this.createEntity(type);
		}
		return entity;
	}

	recycleEntity(entity: ECSEntity): void {
		entity.setEnabled(false);
		const type = entity.type as EntityType;
		const pool = this.entityPools.get(type);
		if (pool) {
			pool.push(entity);
		}
	}

	private createEntity(type:EntityType): ECSEntity {
		const entity = new ECSEntity();
		this.initializeComponents(entity, type);
		return entity;
	}

	private initializeComponents(entity: ECSEntity, type: EntityType):void{
		requiredComponents[type].forEach(componentName => {
            if (!entity.hasComponentByName(componentName)) {
                entity.addComponent(ComponentFactory.getInstance().createComponent(componentName));
            }
        });
	}

	

}