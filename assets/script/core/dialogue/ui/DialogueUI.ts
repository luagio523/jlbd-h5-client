import { _decorator, Node } from 'cc';
import { FairyUIAdapter } from '../../ui/UIAdapter';

const { ccclass } = _decorator;

export abstract class DialogueUI extends  FairyUIAdapter {
    abstract show(dialogue:any): void; // 显示对话
    abstract hide(): void; // 隐藏对话
}


