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
    /******************直接触发的事件*********************** */
    protected fireEvent(event: IEvent): void {
        EventListenerManager.getInstance().dispatchEvent(event.type,event);
    }

    protected listenEvent(eventType: string, listener: (event: IEvent) => void): void {
        EventListenerManager.getInstance().registerListener(eventType, listener);
    }

    /***********************事件队列 批量处理****************************** */
    protected enqueueEvent(event: IEvent): void {
        EventQueueManager.getInstance().enqueue(event.type,event);
    }

    protected getEvents(eventType:string):IEvent[]{
        return EventQueueManager.getInstance().getEvents(eventType)
    }

    protected removeEvents(eventType:string):void{
        EventQueueManager.getInstance().removeEvents(eventType)
    }

    /*******************************处理延时************************************** */

    protected addDelay(delay: number, callback: () => void):number{
        return this.ecs.delayTimer.addTask(delay,callback)
    }

    protected cancelDelay(id:number):void{
        this.ecs.delayTimer.cancelTask(id)
    }

    /********************************组件实体获取************************************* */
    protected getEntitiesWithComponent<T extends ECSComponent>(constructor: Constructor<T>): ECSEntity[]{
        return this.ecs.entities.getEntitiesWithComponent(constructor)
    }

    protected getComponents<T extends ECSComponent>(constructor: Constructor<T>): T[]{
        return this.ecs.components.all(constructor)
    }

    protected getEntity(id:string):ECSEntity{
        return this.ecs.entities.get(id)
    }

    

    public update(dt:number): void {
        // 每个系统具体的更新逻辑
    }
}