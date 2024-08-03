import { IEvent } from "./Event";

export class EventManager {
    private static instance: EventManager;
    private listeners: Map<string, ((event: IEvent) => void)[]> = new Map();

    private constructor() {}

    public static getInstance(): EventManager {
        if (!this.instance) {
            this.instance = new EventManager();
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


    public dispatchEvent(event: IEvent): void {
        const eventListeners = this.listeners.get(event.type);
        if (eventListeners) {
            eventListeners.forEach(listener => {
                listener(event);
            });
        }
    }
}



export class EventDispatcher {
    private eventManager: EventManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
    }

    public on(eventType: string, listener: (event: IEvent) => void): void {
        this.eventManager.registerListener(eventType, listener);
    }

    public off(eventType: string, listener: (event: IEvent) => void): void {
        this.eventManager.unregisterListener(eventType, listener);
    }

    public emit(event: IEvent): void {
        this.eventManager.dispatchEvent(event);
    }

    public getListeners(eventType: string): ((event: IEvent) => void)[] | undefined {
        return this.eventManager.getListeners(eventType);
    }
}