import { IEvent } from "./Event";

export class EventListenerManager {
    private static instance: EventListenerManager;
    private listeners: Map<string, ((event: IEvent) => void)[]> = new Map();

    private constructor() {}

    public static getInstance(): EventListenerManager {
        if (!this.instance) {
            this.instance = new EventListenerManager();
        }
        return this.instance;
    }

    public registerListener(eventType: string, listener: (event: IEvent) => void): void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        const eventListeners = this.listeners.get(eventType);
        if (eventListeners) {
            eventListeners.push(listener);
        }
    }

    public unregisterListener(eventType: string, listener: (event: IEvent) => void): void {
        const eventListeners = this.listeners.get(eventType);
        if (eventListeners) {
            const index = eventListeners.indexOf(listener);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    public getListeners(eventType: string): ((event: IEvent) => void)[] | undefined {
        return this.listeners.get(eventType);
    }


    public dispatchEvent(eventType: string,event: IEvent): void {
        const eventListeners = this.listeners.get(eventType);
        if (eventListeners) {
            eventListeners.forEach(listener => {
                listener(event);
            });
        }
    }
}

