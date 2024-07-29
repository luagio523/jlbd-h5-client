import { _decorator, Node } from 'cc';
import { DialogueUI } from './DialogueUI'; // 确保路径正确
import { GComponent } from 'fairygui-cc';

const { ccclass } = _decorator;

@ccclass('AnimationDialogueUI')
export class AnimationDialogueUI extends DialogueUI {

    public injectUI(ui: GComponent): void {
        super.injectUI(ui)
    }

    show(dialogue:any) {
        
    }

    hide() {
        this.ui.enabled = false;
    }
}
