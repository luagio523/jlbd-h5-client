import { ConfigManager } from '../common/config/ConfigManager';
import { Guide } from './Guide';
import { GuideStep } from './GuideStep';
import { GuideUIHandler } from './GuideUIHandler';

type StepCompletionCallback = (stepId: string) => void;
/**
 * 要保证stepId唯一性，否则会导致订阅失败，用guideId+stepId来唯一标识一个步骤
 */
export class GuideManager {
    private guides: Map<string, Guide> = new Map();
    private uiHandler: GuideUIHandler;
    private stepSubscriptions: Map<string, StepCompletionCallback[]> = new Map();
    private currentGuide: Guide | null = null;

    constructor(uiHandler: GuideUIHandler) {
        this.uiHandler = uiHandler;
    }

    private async loadGuide(id: string): Promise<void> {
        let config = await ConfigManager.getInstance().loadJSON( id )
        const steps = config.steps.map((stepData: any) => new GuideStep(stepData));
        const guide = new Guide(id, steps, config.isForced, this.uiHandler,this.onStepCompleted.bind(this));
        this.guides.set(id, guide);
    }

    
    public async startGuide(id: string): Promise<void> {
        await this.loadGuide(id);
        const guide = this.guides.get(id);
        if (guide) {
            this.currentGuide = guide;
            guide.start();
        }
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

    private onStepCompleted(stepId: string): void {
        const callbacks = this.stepSubscriptions.get(stepId);
        if (callbacks) {
            callbacks.forEach(callback => callback(stepId));
        }
    }

    proceedToNextStep(): void {
        if (this.currentGuide) {
            this.currentGuide.showNextStep();
        }
    }

    endGuide(id: string): void {
        const guide = this.guides.get(id);
        if (guide) {
            guide.end();
            if (this.currentGuide === guide) {
                this.currentGuide = null;
            }
        }
    }

    destroy(): void {
        this.guides.forEach(guide => guide.end());
        this.guides.clear();
        this.stepSubscriptions.clear();
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
