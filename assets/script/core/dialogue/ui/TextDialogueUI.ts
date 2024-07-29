import { _decorator, Node, Label } from 'cc';
import { DialogueUI } from './DialogueUI';
import { GComponent } from 'fairygui-cc';
import { DialogueSpeaker } from '../Dialogue';

const { ccclass, property } = _decorator;

@ccclass('TextDialogueUI')
export class TextDialogueUI extends DialogueUI {
    speakerLabel: Label = null; // 发言者标签

    dialogueLabel: Label = null; // 对话文本标签


    public injectUI(ui: GComponent): void {
        super.injectUI(ui)
    
    }

    show(dialogue:DialogueSpeaker) {
        
    }

    hide() {
        this.ui.enabled = false;
    }
}
