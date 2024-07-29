import { _decorator, Component, Node, Label, Button, instantiate } from 'cc';
import { DialogueManager } from './DialogueManager'; // 确保路径正确
import { MessageManager } from '../common/event/MessageManager';
import { DialogueAnimation, DialogueChoice, DialogueEvent, DialogueSpeaker } from './Dialogue';
const { ccclass, property } = _decorator;

@ccclass('DialogueUI')
export class DialogueComponent extends Component {
    private dialogueManager = DialogueManager.getInstance(); // 获取单例实例

   

    start() {
        this.dialogueManager.loadDialogueData(() => {
            this.startInitialDialogue();
        });
        let messageManager = MessageManager.getInstance();

        messageManager.on(DialogueEvent.ShowDialogue, this.showDialogue.bind(this));
        messageManager.on(DialogueEvent.PlayAnimation, this.playAnimation.bind(this));
        messageManager.on(DialogueEvent.DialogueComplete, this.onDialogueComplete.bind(this));
        messageManager.on(DialogueEvent.ShowChoice, this.showChoice.bind(this));
    }

    startInitialDialogue() {
        // 自动开始对话，选择要开始的对话段
        this.dialogueManager.startDialogue("segment1"); // 可以根据游戏逻辑选择不同的段
    }

    showDialogue(dialogue: DialogueSpeaker) {
        
    }

    playAnimation(animation: DialogueAnimation) {
        console.log(`播放动画: ${animation.animation}`);
        // 在这里播放动画的逻辑
    }

    onDialogueComplete() {
        console.log("对话完成");
    }

    showChoice(choice: DialogueChoice) {
       
    }

    handleChoice(nextSegment: string) {
        this.dialogueManager.startDialogue(nextSegment); // 根据选择跳转到下一个段落
    }

}