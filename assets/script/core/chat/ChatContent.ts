import { ChatContent, ChatMessageType } from "./Chat";

export class NormalChatContent extends ChatContent {
    constructor(messageType: ChatMessageType, text: string, fields: Record<string, string>) {
        super(messageType, text, fields);
    }

    toHtml(): string {
        return `<span class="normal-chat">${this.text}</span>`;
    }
}



