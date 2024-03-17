import { ECSComponent } from "./ECSComponent";
import { ECSComponents } from "./ECSComponents";
import { ECSEntity } from "./ECSEntity";
import { Constructor } from "./__private";


/**
 * 实体集合的实现
 */
export class ECSEntities  {


    /**
     * 跟踪所有组件
     */
    readonly components = new ECSComponents();

    /**
     * 跟踪所有实体
     */
    private entities = new Set<ECSEntity>();

    /**
     * 按照实体 ID 跟踪所有实体
     */
    private entitiesById = new Map<string, ECSEntity>();

    /**
     * 所有实体的总数
     */
    size(): number {
        return this.entities.size;
    }

    /**
     * 检查指定 ID 的实体是否存在
     *
     * @param id
     */
    has(id: string): boolean {
        return this.entitiesById.has(id);
    }

    /**
     * 取得指定 ID 的实体
     *
     * @param id
     */
    get(id: string): ECSEntity {
        const entity = this.entitiesById.get(id);
        if (!entity) {
            throw new RangeError(`[ECS] not found entity '${id}'`);
        }
        return entity;
    }


    getEntitiesWithComponent<T extends ECSComponent>(constructor: Constructor<T>):  ECSEntity[] {
        const entitiesWithComponent: ECSEntity[] = [];
        for (let entity of this.entities) {
            if (entity.hasComponent(constructor)) {
                entitiesWithComponent.push(entity);
            }
        }
        return entitiesWithComponent; 
    }

    /**
     * 添加实体
     *
     * @param entity
     */
    add(entity: ECSEntity): void {
        entity.globalComponentsRef = this.components;
        entity.setEnabled(true);
        this.entities.add(entity);
        this.entitiesById.set(entity.id, entity);
    }
    
    /**
     * 删除指定实体
     *
     * @param entity
     */
    delete(entity: string | ECSEntity): void {
        if (typeof entity === "string") {
            entity = this.get(entity);
        }
        entity.setEnabled(false);
        entity.globalComponentsRef = undefined;
        this.entities.delete(entity);
        this.entitiesById.delete(entity.id);
    }

    /**
     * 删除所有实体
     */
    clear(): void {
        this.entities.forEach((entity) => this.delete(entity));
    }
}
