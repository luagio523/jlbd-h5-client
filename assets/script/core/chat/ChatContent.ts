import { ChatContent, ChatMessageType } from "./Chat";

export class NormalChatContent extends ChatContent {
    messageType: ChatMessageType = ChatMessageType.NORMAL;
    constructor(text: string, fields: Record<string, string>) {
        super( text, fields);
    }

    toDisplayString(): string {
        return `<span class="normal-chat">${this.text}</span>`;
    }
}



