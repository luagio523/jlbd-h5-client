import { MarqueeContent, MarqueeMessage, MarqueeMessageType } from "./Marquee";

export class MarqueeMessageProcessor {
    private typeMap: Map<MarqueeMessageType, new ( text: string, fields: Record<string, string>) => MarqueeContent>;

    constructor() {
        this.typeMap = new Map();
    }

    encode(content: MarqueeContent): string {
        return JSON.stringify({
            messageType: content.messageType,
            text: content.text,
            fields: content.fields
        });
    }

    decode(message: MarqueeMessage): MarqueeContent {
        let data: any;
        try {
            data = JSON.parse(message.content);
        } catch (error) {
            console.error('Failed to parse message content:', error);
            throw new Error('Invalid message content');
        }

        const ContentClass = this.typeMap.get(data.messageType as MarqueeMessageType);
        if (!ContentClass) {
            throw new Error(`Unknown message type: ${data.messageType}`);
        }

        return new ContentClass(data.text, data.fields);
    }

    // 添加一个方法来注册新的消息类型
    registerType(type: MarqueeMessageType, contentClass: new (text: string, fields: Record<string, string>) => MarqueeContent) {
        this.typeMap.set(type, contentClass);
    }
}