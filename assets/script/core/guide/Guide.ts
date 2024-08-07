import { GuideStep } from "./GuideStep";
import { GuideUIHandler } from "./GuideUIHandler";

export class Guide {
    id: string;
    steps: GuideStep[];
    currentStepIndex: number;
    isForced: boolean;
    postGuideId: string | null;
    savePoint: string | null;
    private uiHandler: GuideUIHandler;
    private onStepCompleted: (stepId: string) => void;
    private onGuideCompleted: (guideId: string, postGuideId: string | null) => void;
    private onSavePoint: (guideId: string, stepId: string) => void;

    constructor(
        id: string,
        steps: GuideStep[],
        isForced: boolean,
        savePoint:string | null,
        postGuideId: string | null,
        uiHandler: GuideUIHandler,
        onStepCompleted: (stepId: string) => void,
        onGuideCompleted: (guideId: string, postGuideId: string | null) => void,
        onSavePoint: (guideId: string, stepId: string) => void
    ) {
        this.id = id;
        this.steps = steps;
        this.currentStepIndex = 0;
        this.isForced = isForced;
        this.savePoint = savePoint;
        this.postGuideId = postGuideId;
        this.uiHandler = uiHandler;
        this.onStepCompleted = onStepCompleted;
        this.onGuideCompleted = onGuideCompleted;
        this.onSavePoint = onSavePoint;
    }

    start(): void {
        this.showNextStep();
    }

    showNextStep(): void {
        if (this.currentStepIndex < this.steps.length) {
            const currentStep = this.steps[this.currentStepIndex];
            if (currentStep.shouldTrigger()) {
               
                this.uiHandler.showIndicator(currentStep.action, () => {
                    this.onStepCompleted(currentStep.id);
                    if (currentStep.id == this.savePoint) { //有设置保存点
                        this.onSavePoint(this.id, currentStep.id);
                    }
                    this.currentStepIndex++;
                    this.showNextStep();
                });
            } else {
              
            }
        } else {
            this.end();
        }
    }

    end(): void {
        this.uiHandler.clear();
        const currentStep = this.steps[this.currentStepIndex];
        if ( !this.savePoint) { //没有设置保存点时，默认保存最后一步
            this.onSavePoint(this.id, currentStep.id);
        }
        this.onGuideCompleted(this.id, this.postGuideId);
    }

    setCurrentStep(stepId: string): void {
        const stepIndex = this.steps.findIndex(step => step.id === stepId);
        if (stepIndex !== -1) {
            this.currentStepIndex = stepIndex;
        }
    }
}
