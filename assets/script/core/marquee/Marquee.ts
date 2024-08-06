
export enum MarqueeChannelType {
    SYSTEM,
}


/**
 * 跑马灯消息类型
 */
export enum MarqueeMessageType {
    NORMAL,
}

/**
 * 跑马灯消息
 */
export interface MarqueeMessage {
    id?: string;
    channelType: MarqueeChannelType;
    content: string;
    priority: number;
    timestamp: number;
    displayTime: number;
}

/**
 * 跑马灯内容
 */
export abstract class MarqueeContent {
    abstract messageType: MarqueeMessageType;
    public text: string;
    public fields: Record<string, string>;

    constructor(
        text: string,
        fields: Record<string, string>
    ) {
        this.text = text;
        this.fields = fields;
    }

    abstract toDisplayString(): string;

    protected getField(key: string, defaultValue: string = ''): string {
        return this.fields[key] || defaultValue;
    }
}




// 示例实现
export class NormalMarqueeContent extends MarqueeContent {
    messageType = MarqueeMessageType.NORMAL;
    constructor(text: string, fields: Record<string, string> = {}) {
        super(text, fields);
    }

    toDisplayString(): string {
        return this.text;
    }
}




