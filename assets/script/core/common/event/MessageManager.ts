import { log, warn } from "cc";

type MessageHandler = (data?: any) => void;

interface Subscription {
    handler: MessageHandler;
    context: any;
    once: boolean;
}

export class MessageManager {
    private static instance: MessageManager;
    private subscriptions: Map<string, Set<Subscription>> = new Map();

    private constructor() {}

    public static getInstance(): MessageManager {
        if (!MessageManager.instance) {
            MessageManager.instance = new MessageManager();
        }
        return MessageManager.instance;
    }

    public on(message: string, handler: MessageHandler, context: any = null): void {
        if (!message || typeof handler !== 'function') {
            warn(`Invalid message or handler for: ${message}`);
            return;
        }

        if (!this.subscriptions.has(message)) {
            this.subscriptions.set(message, new Set());
        }

        const subscription: Subscription = { handler, context, once: false };
        this.subscriptions.get(message).add(subscription);
    }

    public once(message: string, handler: MessageHandler, context: any = null): void {
        if (!message || typeof handler !== 'function') {
            warn(`Invalid message or handler for: ${message}`);
            return;
        }

        if (!this.subscriptions.has(message)) {
            this.subscriptions.set(message, new Set());
        }

        const subscription: Subscription = { handler, context, once: true };
        this.subscriptions.get(message).add(subscription);
    }

    public off(message: string, handler?: MessageHandler, context: any = null): void {
        if (!this.subscriptions.has(message)) {
            return;
        }

        const subscriptions = this.subscriptions.get(message);

        if (handler) {
            subscriptions.forEach(subscription => {
                if (subscription.handler === handler && subscription.context === context) {
                    subscriptions.delete(subscription);
                }
            });
        } else {
            this.subscriptions.delete(message);
        }
    }

    public emit(message: string, data?: any): void {
        if (!this.subscriptions.has(message)) {
            return;
        }

        const subscriptions = this.subscriptions.get(message);
        const toRemove: Subscription[] = [];

        subscriptions.forEach(subscription => {
            subscription.handler.call(subscription.context, data);
            if (subscription.once) {
                toRemove.push(subscription);
            }
        });

        // Remove 'once' subscriptions
        toRemove.forEach(subscription => subscriptions.delete(subscription));

        // If all subscriptions are removed, delete the message entry
        if (subscriptions.size === 0) {
            this.subscriptions.delete(message);
        }
    }

    public clear(): void {
        this.subscriptions.clear();
    }

    public getSubscriptionCount(message: string): number {
        return this.subscriptions.has(message) ? this.subscriptions.get(message).size : 0;
    }
}

//另外再提供一个包装器,用于明确的订阅
export class MessageSubscriber {
    private manager: MessageManager = MessageManager.getInstance();
    private subscribedMessages: Set<string> = new Set();

    public on(message: string, handler: MessageHandler, context: any = null): void {
        this.manager.on(message, handler, context);
        this.subscribedMessages.add(message);
    }

    public once(message: string, handler: MessageHandler, context: any = null): void {
        this.manager.once(message, handler, context);
        this.subscribedMessages.add(message);
    }

    public off(message: string, handler?: MessageHandler, context: any = null): void {
        this.manager.off(message, handler, context);
        if (!handler) {
            this.subscribedMessages.delete(message);
        }
    }

    public emit(message: string, data?: any): void {
        this.manager.emit(message, data);
    }

    public clear(): void {
        this.subscribedMessages.forEach(message => {
            this.manager.off(message);
        });
        this.subscribedMessages.clear();
    }
}