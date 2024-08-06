// Guide.ts
import { GuideStep } from './GuideStep';
import { GuideUIHandler } from './GuideUIHandler';

export class Guide {
    id: string;
    steps: GuideStep[];
    currentStepIndex: number;
    isForced: boolean;
    private uiHandler: GuideUIHandler;
    private onStepCompleted: (stepId: string) => void;

    constructor(
        id: string,
        steps: GuideStep[],
        isForced: boolean,
        uiHandler: GuideUIHandler,
        onStepCompleted: (stepId: string) => void
    ) {
        this.id = id;
        this.steps = steps;
        this.currentStepIndex = 0;
        this.isForced = isForced;
        this.uiHandler = uiHandler;
        this.onStepCompleted = onStepCompleted;
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
                    this.currentStepIndex++;
                });
            } else {
                this.currentStepIndex++;
                this.showNextStep();
            }
        } else {
            this.end();
        }
    }

    end(): void {
        this.uiHandler.clear();
        this.currentStepIndex = 0;
    }
}
