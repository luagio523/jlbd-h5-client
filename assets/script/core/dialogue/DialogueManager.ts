import { _decorator, resources, JsonAsset } from 'cc';
import { MessageManager } from '../common/event/MessageManager';
import { DialogueEvent } from './Dialogue';
import { StorageManager } from '../common/storage/StorageManager';
const { ccclass } = _decorator;

@ccclass('DialogueManager')
export class DialogueManager {
    private static instance: DialogueManager = null; // 单例实例
    private messageManager: MessageManager; // 消息管理器实例
    private dialogueSegments: { [key: string]: any[] } = {}; // 存储对话段
    private currentSegmentId: string | null = null; // 当前段落ID
    private currentDialogueIndex: number = 0; // 当前对话索引

    // 获取单例实例
    public static getInstance(): DialogueManager {
        if (!this.instance) {
            this.instance = new DialogueManager();
        }
        return this.instance;
    }

    private constructor() {
        this.messageManager = MessageManager.getInstance();
    }

    loadDialogueData(callback: () => void) {
        resources.load("dialogues", JsonAsset, (err, asset) => {
            if (!err) {
                this.dialogueSegments = asset.json.dialogueSegments;
                callback();
            } else {
                console.error("Failed to load dialogues:", err);
            }
        });
    }

    startDialogue(segmentId: string) {
        if (this.dialogueSegments[segmentId]) {
            this.currentSegmentId = segmentId;
            this.currentDialogueIndex = 0; // 重置对话索引
            this.loadProgress(); // 加载上次的进度
            this.nextStep();
        } else {
            console.error(`Segment ${segmentId} not found.`);
        }
    }

    nextStep() {
        if (this.currentSegmentId && this.currentDialogueIndex < this.dialogueSegments[this.currentSegmentId].length) {
            const step = this.dialogueSegments[this.currentSegmentId][this.currentDialogueIndex];
            this.handleStep(step);
            this.currentDialogueIndex++;
        } else {
            this.messageManager.emit(DialogueEvent.DialogueComplete, { segmentId: this.currentSegmentId });
            this.saveProgress(); // 保存进度
        }
    }

    handleStep(step: any) {
        if (step.type === "dialogue") {
            this.messageManager.emit(DialogueEvent.ShowDialogue, step);
        } else if (step.type === "animation") {
            this.messageManager.emit(DialogueEvent.PlayAnimation, step);
        } else if (step.type === "choice") {
            this.messageManager.emit(DialogueEvent.ShowChoice, step);
        }
    }

    saveProgress() {
        const progress = {
            segmentId: this.currentSegmentId,
            dialogueIndex: this.currentDialogueIndex
        };
        StorageManager.getInstance().setItem("dialogueProgress", progress);
    }

    loadProgress() {
        const progress = StorageManager.getInstance().getItem<any>("dialogueProgress");
        if (progress && progress.segmentId === this.currentSegmentId) {
            this.currentDialogueIndex = progress.dialogueIndex;
        }
    }
}
