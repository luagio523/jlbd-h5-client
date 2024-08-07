import { ConfigManager } from '../common/config/ConfigManager';
import { StorageManager } from '../common/storage/StorageManager';
import { Guide } from './Guide';
import { GuideStep } from './GuideStep';
import { GuideUIHandler } from './GuideUIHandler';
import { IGuideCondition } from './GuideCondition';

type StepCompletionCallback = (stepId: string) => void;
type GuideCompletionCallback = (guideId: string) => void;
/**
 * 支持多个引导管理
 * 1. 每个guide设置保存点后。执行完保存点所在step,则此次引导记录完成。其他步骤不影响。
 * 未设置保存点时，默认最后一步引导记录完成。保存点适合于重要数据节点
 * 2. 要求每个guide 唯一，每个step 唯一
 */
export class GuideManager {
    private guides: Map<string, Guide> = new Map();
    private completedGuides: Map<string, boolean> = new Map(); // 新增：完成状态的 用于支持服务器数据同步
    private uiHandler: GuideUIHandler;
    private conditionHandler: IGuideCondition;
    private stepSubscriptions: Map<string, StepCompletionCallback[]> = new Map();
    private guideSubscriptions: Map<string, GuideCompletionCallback[]> = new Map();
    private currentGuide: Guide | null = null;
    private storageManager: StorageManager = StorageManager.getInstance();

    constructor(uiHandler: GuideUIHandler, conditionHandler: IGuideCondition) {
        this.uiHandler = uiHandler;
        this.conditionHandler = conditionHandler;
    }

     // 新增：设置引导完成状态的方法
     public setGuideCompletionStatus(guideId: string, isCompleted: boolean): void {
        this.completedGuides.set(guideId, isCompleted);

        // 标记引导为已完成
        this.storageManager.setItem(`guideState_${guideId}`, 1);
    }

    // 新增：批量设置引导完成状态的方法
    public setGuidesCompletionStatus(completionStatus: { [guideId: string]: boolean }): void {
        Object.entries(completionStatus).forEach(([guideId, isCompleted]) => {
            this.completedGuides.set(guideId, isCompleted);
        });
    }

    public async load(guides:string[]): Promise<void> {
        for (const guideName of guides) {
            try {
                const config = await ConfigManager.getInstance().loadJSON(guideName);
                this.initGuide(config);
            } catch (error) {
                console.error(`Error loading guide ${guideName}:`, error);
            }
        }
    }

    private initGuide(config: any): void {
        const id = config.id;
        if (this.guides.has(id)) return; // 如果已加载，则跳过

        // 检查引导是否已经完成
        if (this.isGuideCompleted(id)) return;

        const steps = config.steps.map((stepData: any) => {
            // 为每个步骤获取触发函数
            const condition = this.conditionHandler.getStepCondition(id, stepData.id);
            
            // 创建 GuideStep 实例，传入触发函数
            return new GuideStep({
                id: stepData.id,
                action: stepData.action, // 假设 action 已经在配置中定义
                condition: condition,
                isForced: stepData.isForced || false
            });
        });

        const guide = new Guide(
            id, 
            steps, 
            config.isForced, 
            config.savePoint || null,
            config.postGuide || null,
            this.uiHandler,
            this.onStepCompleted.bind(this),
            this.onGuideCompleted.bind(this),
            this.onSavePoint.bind(this)
        );
        this.guides.set(id, guide);
    }

    public async startGuide(id: string): Promise<void> {
        const guide = this.guides.get(id);
        if (guide) {
            this.currentGuide = guide;
            guide.start();
        }
    }

    

    private onSavePoint(guideId: string, stepId: string): void {
        // 在这里实现保存逻辑，例如将当前引导和步骤ID保存到本地存储
        console.log(`Save point reached for guide ${guideId} at step ${stepId}`);
        this.storageManager.setItem(`guideState_${guideId}`, 1);
    }

    private isGuideCompleted(guideId: string): boolean {
        // 从本地存储获取保存的状态
        if (this.completedGuides.size > 0) {
            return this.completedGuides.get(guideId) || false;
        }
        return this.storageManager.getItem<number>(`guideState_${guideId}`) === 1;
    }


    subscribeToStep(stepId: string, callback: StepCompletionCallback): void {
        if (!this.stepSubscriptions.has(stepId)) {
            this.stepSubscriptions.set(stepId, []);
        }
        this.stepSubscriptions.get(stepId)!.push(callback);
    }

    unsubscribeFromStep(stepId: string, callback: StepCompletionCallback): void {
        const callbacks = this.stepSubscriptions.get(stepId);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    subscribeToGuideCompletion(guideId: string, callback: GuideCompletionCallback): void {
        if (!this.guideSubscriptions.has(guideId)) {
            this.guideSubscriptions.set(guideId, []);
        }
        this.guideSubscriptions.get(guideId)!.push(callback);
    }

    unsubscribeFromGuideCompletion(guideId: string, callback: GuideCompletionCallback): void {
        const callbacks = this.guideSubscriptions.get(guideId);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    private onStepCompleted(stepId: string): void {
        const callbacks = this.stepSubscriptions.get(stepId);
        if (callbacks) {
            callbacks.forEach(callback => callback(stepId));
        }
    }

    private onGuideCompleted(guideId: string, postGuideId: string | null): void {
        const callbacks = this.guideSubscriptions.get(guideId);
        if (callbacks) {
            callbacks.forEach(callback => callback(guideId));
        }
          // 标记引导为已完成
        this.setGuideCompletionStatus(guideId, true);
        // 清理当前引导
        this.currentGuide = null;

        // 检查是否有后置引导
        if (postGuideId) {
            this.startGuide(postGuideId); // 开始后置引导
        }
    }

    public proceedToNextStep(): void {
        if (this.currentGuide) {
            this.currentGuide.showNextStep();
        }
    }

    public endGuide(id: string): void {
        const guide = this.guides.get(id);
        if (guide) {
            guide.end();
        }
    }

    public tryTriggerGuides(): void {
        if (this.currentGuide) return; // 如果有正在进行的引导，则跳过
        this.guides.forEach(guide => {
            if (!guide.isForced && guide.steps[guide.currentStepIndex].shouldTrigger()) {
                this.currentGuide = guide;
                guide.start();
            }
        });
    }

    destroy(): void {
        this.guides.forEach(guide => guide.end());
        this.guides.clear();
        this.stepSubscriptions.clear();
        this.guideSubscriptions.clear();
        this.currentGuide = null;
    }
}
