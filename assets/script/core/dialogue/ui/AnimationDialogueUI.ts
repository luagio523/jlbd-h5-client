import { _decorator, Node } from 'cc';
import { DialogueUI } from './DialogueUI'; // 确保路径正确
import { GComponent } from 'fairygui-cc';
import { DialogueAnimation } from '../Dialogue';

const { ccclass } = _decorator;

@ccclass('AnimationDialogueUI')
export class AnimationDialogueUI extends DialogueUI {

    public injectUI(ui: GComponent): void {
        super.injectUI(ui)
    }

    show(dialogue:DialogueAnimation) {
        
    }

    hide() {
        this.ui.enabled = false;
    }
}
