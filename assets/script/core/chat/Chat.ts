export enum ChannelType {
    SYSTEM,
    WORLD,
    TEAM,
    PRIVATE,
    HUB , // 综合频道
}

/**
 * 聊天消息类型
 */
export enum ChatMessageType {
    NORMAL,
    SPECIAL_KILL,
    WORLD_CHAT,
}

/**
 * 聊天消息
 */
export interface ChatMessage {
    id?: string;
    channelType: ChannelType;
    senderId: string;
    content: string;
    timestamp: number;
}

/**
 * 聊天内容
 */
export abstract class ChatContent {
    public messageType: ChatMessageType;
    public text: string;
    public fields: Record<string, string>;

    constructor(
        messageType: ChatMessageType,
        text: string,
        fields: Record<string, string>
    ) {
        this.messageType = messageType;
        this.text = text;
        this.fields = fields;
    }

    abstract toHtml(): string;

    protected getField(key: string, defaultValue: string = ''): string {
        return this.fields[key] || defaultValue;
    }
}

