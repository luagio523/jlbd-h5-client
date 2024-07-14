import { Component } from "cc";
import { TransformComponent } from "../component/TransformComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { EntityType } from "../enum/Type";
import { ComponentFactory } from "../factory/ComponentFactory";
import { UnitComponent } from "../component/UnitComponent";
import { AbilityComponent } from "../component/AbilityComponent";

export default class GameEntity extends ECSEntity {
    private type: EntityType = EntityType.Default;

    setType(type: EntityType): void {
        this.type = type;
    }

    getType(): EntityType {
        return this.type;
    }

    reset(): void {
        // 重置实体的状态
      
    }
}

export class HeroEntity extends GameEntity {
    private static readonly REQUIRED_COMPONENTS = [
        "TransformComponent",
        "UnitComponent",
        "AbilityComponent"
    ];

    constructor() {
        super();
        this.setType(EntityType.Hero);
    }

    public initializeComponents(): void {
        const factory = ComponentFactory.getInstance();
        
        HeroEntity.REQUIRED_COMPONENTS.forEach(componentName => {
            if (!this.hasComponentByName(componentName)) {
                this.addComponent(factory.createComponent(componentName));
            }
        });
    }
}
