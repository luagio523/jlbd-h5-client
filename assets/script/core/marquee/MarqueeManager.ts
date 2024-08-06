import scheduler from "../../utils/scheduler";
import { IMarqueeDisplay } from "./IMarqueeDisplay";
import { MarqueeChannelType, MarqueeContent, MarqueeMessage, MarqueeMessageType, NormalMarqueeContent } from "./Marquee";
import { MarqueeMessageProcessor } from "./MarqueeMessageProcessor";

export class MarqueeManager {
    private messages: MarqueeMessage[] = [];
    private currentMessage: MarqueeMessage | null = null;
    private display: IMarqueeDisplay;
    private isProcessing: boolean = false;
    private processor: MarqueeMessageProcessor = new MarqueeMessageProcessor();
    private isRunning: boolean = true;
    private timeoutId: number | null = null;

    constructor(display: IMarqueeDisplay) {
        this.display = display;
        this.registerMessageType(MarqueeMessageType.NORMAL, NormalMarqueeContent);
    }

    registerMessageType(messageType: MarqueeMessageType, contentClass: new (text: string, fields: Record<string, string>) => MarqueeContent): void {
        this.processor.registerType(messageType, contentClass);
    }

    createMessage(channelType: MarqueeChannelType, data: MarqueeContent, priority: number = 1, displayTime: number = 3): MarqueeMessage {
        const content = this.processor.encode(data);
        const message: MarqueeMessage = {
            channelType: channelType,
            content: content,
            priority: priority,
            displayTime: displayTime,
            timestamp: Date.now()
        };
        return message;
    }

    processMessage(message: MarqueeMessage): void {
        try {
            const chatContent = this.processor.decode(message);
            message.content = chatContent.toDisplayString();
            this.messages.push(message);
            this.sortMessages();
            if (this.isRunning) {
                this.processNextMessage();
            }
        } catch (error) {
            console.error('Failed to process message:', error);
        }
    }

    removeMessage(id: string): void {
        const index = this.messages.findIndex(msg => msg.id === id);
        if (index !== -1) {
            this.messages.splice(index, 1);
            if (this.currentMessage && this.currentMessage.id === id) {
                this.display.hide(this.currentMessage);
                this.currentMessage = null;
                if (this.isRunning) {
                    this.processNextMessage();
                }
            }
        }
    }

    private sortMessages(): void {
        this.messages.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp);
    }

    private processNextMessage(): void {
        if (this.isProcessing || this.messages.length === 0 || !this.isRunning) {
            return;
        }

        this.isProcessing = true;

        if (this.currentMessage) {
            this.display.hide(this.currentMessage);
        }

        this.currentMessage = this.messages.shift()!;
        this.display.show({ ...this.currentMessage });

        this.timeoutId = scheduler.performWithDelayGlobal(() => {
            this.isProcessing = false;
            this.processNextMessage();
        }, this.currentMessage.displayTime ) as number;
    }

    getCurrentMessage(): MarqueeMessage | null {
        return this.currentMessage;
    }

    getPendingMessages(): MarqueeMessage[] {
        return [...this.messages];
    }

    start(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.processNextMessage();
        }
    }

    stop(): void {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.timeoutId !== null) {
                scheduler.unscheduleGlobal(this.timeoutId);
                this.timeoutId = null;
            }
            if (this.currentMessage) {
                this.display.hide(this.currentMessage);
                this.messages.unshift(this.currentMessage);
                this.currentMessage = null;
            }
            this.isProcessing = false;
        }
    }

    isMarqueeRunning(): boolean {
        return this.isRunning;
    }
}