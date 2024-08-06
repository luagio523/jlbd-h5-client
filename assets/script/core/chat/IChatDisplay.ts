import { ChatMessage } from "./Chat";

export interface IChatDisplay {
    displayMessage(chatMessage: ChatMessage): void;
    getCurrentUserId(): string;
}