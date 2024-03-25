import { IEvent } from "./Event";
import { EventListenerManager } from "./EventListenerManager";

export class EventQueueManager {
    private static instance: EventQueueManager;
    private queues: Map<string, IEvent[]> = new Map();

    private constructor() {}

    public static getInstance(): EventQueueManager {
        if (!this.instance) {
            this.instance = new EventQueueManager();
        }
        return this.instance;
    }

    public enqueue(eventType: string,event: IEvent): void {
        if (!this.queues.has(eventType)) {
            this.queues.set(eventType, []);
        }
        this.queues.get(eventType)?.push(event);
    }

    public getEvents(eventType: string): IEvent[] {
        return this.queues.get(eventType) || [];
    }

    public removeEvents(eventType: string): void {
        // 移除指定类型的所有事件
        this.queues.delete(eventType);
    }

    public dispatch() {
        // 这里是简化的处理，实际情况下可能需要考虑事件的优先级等因素
        this.queues.forEach((events, type) => {
            const listeners = EventListenerManager.getInstance().getListeners(type);
            events.forEach(event => {
                listeners.forEach(listener => listener(event));
            });
            // 清除已经处理过的事件 this.removeEvents(type)  //不需要
            events.length = 0;
        });
    }

    public clear() {
        this.queues.forEach((events) => events.length = 0);
    }
}