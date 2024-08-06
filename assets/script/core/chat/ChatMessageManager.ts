import { ChannelType, ChatMessage, ChatContent, ChatMessageType } from "./Chat";
import { ChatMessageProcessor } from "./ChatMessageProcessor";
import { IChatDisplay } from "./IChatDisplay";
import { NormalChatContent } from "./ChatContent";

export class ChatMessageManager {
    private processor: ChatMessageProcessor = new ChatMessageProcessor();
    private messageCache: Map<ChannelType, ChatMessage[]> = new Map();
    private maxMessagesPerChannel: number = 50;
    private cleanupThreshold: number = 10;
    private chatDisplay: IChatDisplay;

    constructor(chatDisplay: IChatDisplay) {
        this.chatDisplay = chatDisplay;
        this.registerMessageType(ChatMessageType.NORMAL, NormalChatContent)
    }

    registerMessageType(messageType: ChatMessageType, contentClass: new ( text: string, fields: Record<string, string>) => ChatContent): void {
        this.processor.registerType(messageType,contentClass);
    }

    createMessage(channelType: ChannelType, data: ChatContent): ChatMessage {
        const content = this.processor.encode(data);
        const message: ChatMessage = {
            channelType: channelType,
            senderId: this.chatDisplay.getCurrentUserId(),
            content: content,
            timestamp: Date.now()
        };
        return message;
    }

    processMessage(message: ChatMessage) {
        const chatContent = this.processor.decode(message);
        message.content = chatContent.toDisplayString();
        this.addMessageToCache(message.channelType, message);
        if (message.channelType !== ChannelType.HUB) { 
            this.addMessageToCache(ChannelType.HUB, message);
        }
        this.chatDisplay.displayMessage(message);
    }

    private addMessageToCache(channelType: ChannelType, message: ChatMessage): void {
        if (!this.messageCache.has(channelType)) {
            this.messageCache.set(channelType, []);
        }

        const messages = this.messageCache.get(channelType)!;
        messages.push(message);

        // 如果消息数量超过阈值，进行清理
        if (messages.length > this.maxMessagesPerChannel + this.cleanupThreshold) {
            this.cleanupOldMessages(channelType);
        }
    }

    private cleanupOldMessages(channelType: ChannelType): void {
        const messages = this.messageCache.get(channelType)!;
        // 保留最新的 maxMessagesPerChannel 条消息
        this.messageCache.set(channelType, messages.slice(-this.maxMessagesPerChannel));
    }
}