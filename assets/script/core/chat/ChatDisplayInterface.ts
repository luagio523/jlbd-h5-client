import { ChatMessage } from "./Chat";

export interface ChatDisplayInterface {
    displayMessage(chatMessage: ChatMessage): void;
    getCurrentUserId(): string;
}