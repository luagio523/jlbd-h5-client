import { _decorator, Component, Node, Label, Button, instantiate } from 'cc';
import { DialogueManager } from './DialogueManager'; // 确保路径正确
import { MessageManager } from '../common/event/MessageManager';
import { Dialogue, DialogueAnimation, DialogueChoice, DialogueEvent } from './Dialogue';
const { ccclass, property } = _decorator;

@ccclass('DialogueUI')
export class DialogueComponent extends Component {
    private dialogueManager = DialogueManager.getInstance(); // 获取单例实例

    @property(Node)
    dialogueContainer: Node = null; // 对话框容器

    @property(Label)
    speakerLabel: Label = null; // 发言者标签

    @property(Label)
    dialogueLabel: Label = null; // 对话文本标签

    @property(Node)
    choiceContainer: Node = null; // 选择项容器

    @property(Button)
    choiceButtonPrefab: Button = null; // 选择项按钮预制体

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

    showDialogue(dialogue: Dialogue) {
        this.speakerLabel.string = dialogue.speaker; // 设置发言者
        this.dialogueLabel.string = dialogue.text; // 设置对话文本
        this.dialogueContainer.active = true; // 显示对话框
        this.choiceContainer.active = false; // 隐藏选择项
        // 这里可以根据 position 来调整 UI 显示
        // 例如: if (dialogue.position === "left") { ... }
    }

    playAnimation(animation: DialogueAnimation) {
        console.log(`播放动画: ${animation.animation}`);
        // 在这里播放动画的逻辑
    }

    onDialogueComplete() {
        console.log("对话完成");
        this.dialogueContainer.active = false; // 隐藏对话框
    }

    showChoice(choice: DialogueChoice) {
        this.dialogueLabel.string = choice.question; // 显示选择问题
        this.dialogueContainer.active = true; // 显示对话框
        this.choiceContainer.active = true; // 显示选择项
        this.clearChoices(); // 清空之前的选择项

        choice.options.forEach(option => {
            const button = instantiate(this.choiceButtonPrefab); // 实例化按钮
            button.getComponentInChildren(Label).string = option.text; // 设置按钮文本
            button.node.on(Button.EventType.CLICK, () => this.handleChoice(option.nextSegment), this); // 添加点击事件
            this.choiceContainer.addChild(button.node); // 将按钮添加到选择项容器
        });
    }

    handleChoice(nextSegment: string) {
        this.dialogueManager.startDialogue(nextSegment); // 根据选择跳转到下一个段落
    }

    clearChoices() {
        // 清空选择项容器中的所有按钮
        this.choiceContainer.removeAllChildren();
    }
}
