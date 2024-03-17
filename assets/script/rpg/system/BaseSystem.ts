import { ECSComponent } from "../ecs/ECSComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { ECSSystem } from "../ecs/ECSSystem";
import { Constructor } from "../ecs/__private";
import { IEvent } from "../event/Event";
import { EventListenerManager } from "../event/EventListenerManager";
import { EventQueueManager } from "../event/EventQueueManager";

export class BaseSystem extends ECSSystem{

    constructor() {
        super()
    }

    protected fireEvent(event: IEvent): void {
        EventQueueManager.getInstance().enqueue(event);
    }

    protected listen(eventType: string, listener: (event: IEvent) => void): void {
        EventListenerManager.getInstance().registerListener(eventType, listener);
    }


    protected getEntitiesWithComponent<T extends ECSComponent>(constructor: Constructor<T>): ECSEntity[]{
        return this.ecs.entities.getEntitiesWithComponent(constructor)
    }

    protected getComponents<T extends ECSComponent>(constructor: Constructor<T>): T[]{
        return this.ecs.components.all(constructor)
    }

    public update(dt:number): void {
        // 每个系统具体的更新逻辑
    }
}