import { ChatMessage, ChatMessageType, ChatContent } from "./Chat";

export class ChatMessageProcessor {
    private typeMap: Map<ChatMessageType, new (text: string, fields: Record<string, string>) => ChatContent>;

    constructor() {
        this.typeMap = new Map([
           
        ]);
    }

    encode(content: ChatContent): string {
        return JSON.stringify({
            messageType: content.messageType,
            text: content.text,
            fields: content.fields
        });
    }

    decode(message: ChatMessage): ChatContent {
        let data: any;
        try {
            data = JSON.parse(message.content);
        } catch (error) {
            console.error('Failed to parse message content:', error);
            throw new Error('Invalid message content');
        }

        const ContentClass = this.typeMap.get(data.messageType as ChatMessageType);
        if (!ContentClass) {
            throw new Error(`Unknown message type: ${data.messageType}`);
        }

        return new ContentClass(data.text, data.fields);
    }

    // 添加一个方法来注册新的消息类型
    registerType(type: ChatMessageType, contentClass: new ( text: string, fields: Record<string, string>) => ChatContent) {
        this.typeMap.set(type, contentClass);
    }
}
