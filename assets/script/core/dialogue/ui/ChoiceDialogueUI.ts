import { _decorator, Node, Button, Label, instantiate } from 'cc';
import { DialogueUI } from './DialogueUI'; // 确保路径正确
import { GComponent } from 'fairygui-cc';
import { DialogueChoice } from '../Dialogue';

const { ccclass, property } = _decorator;

@ccclass('ChoiceDialogueUI')
export class ChoiceDialogueUI extends DialogueUI {
   
    public injectUI(ui: GComponent): void {
        super.injectUI(ui)
    }

    handleChoice(nextSegment: string) {
        // 处理选择逻辑
        console.log(`选择了: ${nextSegment}`);
        // 这里可以调用 DialogueManager 的方法来开始下一个段落
    }

    clearChoices() {
        
    }

    createChoiceButton(text: string): void {
        // const button = new Button();
        // button.node.name = 'ChoiceButton';
        // const label = new Label();
        // label.string = text;
        // label.node.parent = button.node;
        // return button;
    }


    show(dialogue:DialogueChoice) {
        this.clearChoices(); // 清空之前的选择项
        let options = dialogue.options;
        options.forEach(option => {
           this.createChoiceButton(option.text)
        });
    }

    hide() {
        this.ui.enabled = false;
    }
}
