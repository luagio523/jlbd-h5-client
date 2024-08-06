import { ConfigManager } from '../common/config/ConfigManager';
import { Guide } from './Guide';
import { GuideStep } from './GuideStep';
import { GuideUIHandler } from './GuideUIHandler';

type StepCompletionCallback = (stepId: string) => void;
type GuideCompletionCallback = (guideId: string) => void;

export class GuideManager {
    private guides: Map<string, Guide> = new Map();
    private uiHandler: GuideUIHandler;
    private stepSubscriptions: Map<string, StepCompletionCallback[]> = new Map();
    private guideSubscriptions: Map<string, GuideCompletionCallback[]> = new Map();
    private currentGuide: Guide | null = null;

    constructor(uiHandler: GuideUIHandler) {
        this.uiHandler = uiHandler;
    }


    private async loadGuide(id: string): Promise<void> {
        if (this.guides.has(id)) return; // 如果已加载，则跳过

        let config = await ConfigManager.getInstance().loadJSON(id);
        const steps = config.steps.map((stepData: any) => new GuideStep(stepData));
        const guide = new Guide(
            id, 
            steps, 
            config.isForced, 
            config.postGuide || null,
            this.uiHandler,
            this.onStepCompleted.bind(this),
            this.onGuideCompleted.bind(this),
            this.onSavePoint.bind(this)
        );
        this.guides.set(id, guide);
    }

    public async startGuide(id: string, fromSavePoint: boolean = false): Promise<void> {
        await this.loadGuide(id);
        const guide = this.guides.get(id);
        if (guide) {
            this.currentGuide = guide;
            if (fromSavePoint) {
                // 从保存点恢复
                const savedState = this.getSavedState(id);
                if (savedState && savedState.guideId === id) {
                    guide.setCurrentStep(savedState.stepId);
                }
            }
            guide.start();
        }
    }

    private onSavePoint(guideId: string, stepId: string): void {
        // 在这里实现保存逻辑，例如将当前引导和步骤ID保存到本地存储
        console.log(`Save point reached for guide ${guideId} at step ${stepId}`);
        localStorage.setItem(`guideState_${guideId}`, JSON.stringify({ guideId, stepId }));
    }

    private getSavedState(guideId: string): { guideId: string, stepId: string } | null {
        // 从本地存储获取保存的状态
        const savedState = localStorage.getItem(`guideState_${guideId}`);
        return savedState ? JSON.parse(savedState) : null;
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

    /**
     * 
     * @returns 
     */
    public tryTriggerGuides(): void {
        if (this.currentGuide) return; // 如果有正在进行的引导，则跳过
        this.guides.forEach(guide => {
            if (!guide.isForced && guide.steps[guide.currentStepIndex].shouldTrigger()) {
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






// // 创建 GuideManager 实例
// const uiHandler = new CocosCreatorGuideUIHandler(someNode);
// const guideManager = new GuideManager(uiHandler);

// // 加载引导
// guideManager.loadGuide('tutorial', tutorialSteps, false);

// // 订阅特定步骤
// guideManager.subscribeToStep('login_step', (stepId) => {
//   console.log(`Step ${stepId} completed`);
//   // 执行登录逻辑
//   loginUser().then(() => {
//     // 登录成功后，继续下一步引导
//     guideManager.proceedToNextStep();
//   });
// });

// // 开始引导
// guideManager.startGuide('tutorial');

// // 在适当的时候结束引导
// guideManager.endGuide('tutorial');

// // 清理
// guideManager.destroy();
