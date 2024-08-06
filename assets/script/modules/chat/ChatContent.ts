import { ChatContent, ChatMessageType } from "../../core/chat/Chat";

export class WorldChatContent extends ChatContent {
    messageType = ChatMessageType.WORLD_CHAT;
    private static HTML_TEMPLATE = `
        {vipBadge}
        <span class="server">[{server}服]</span>
        <span class="level">[Lv.{level}]</span>
        <span class="name">{name}</span>: 
        <span class="text">{text}</span>
    `;

    constructor(text: string, fields: Record<string, string>) {
        super( text, fields);
    }

    get vip(): boolean {
        return this.getField('vip') === '1';
    }

    get level(): number {
        return parseInt(this.getField('level', '0'), 10);
    }

    get server(): string {
        return this.getField('server');
    }

    get name(): string {
        return this.getField('name');
    }

    toDisplayString(): string {
        const vipBadge = this.vip ? '<span class="vip-badge">[VIP]</span>' : '';

        // 使用静态模板并替换占位符
        const htmlContent = WorldChatContent.HTML_TEMPLATE
            .replace('{vipBadge}', vipBadge)
            .replace('{server}', this.server)
            .replace('{level}', this.level.toString())
            .replace('{name}', this.name)
            .replace('{text}', this.text);

        return htmlContent.trim(); // 去掉多余的空白
    }
}