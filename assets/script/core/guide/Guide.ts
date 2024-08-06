// Guide.ts
import { GuideStep } from './GuideStep';
import { GuideUIHandler } from './GuideUIHandler';



export class Guide {
    id: string;
    steps: GuideStep[];
    currentStepIndex: number;
    isForced: boolean;
    private uiHandler: GuideUIHandler;

    constructor(id: string, steps: GuideStep[], isForced: boolean, uiHandler: GuideUIHandler) {
        this.id = id;
        this.steps = steps;
        this.currentStepIndex = 0;
        this.isForced = isForced;
        this.uiHandler = uiHandler;
    }

    start(): void {
        this.showStep(this.currentStepIndex);
    }

    next(): void {
        this.currentStepIndex++;
        this.showStep(this.currentStepIndex);
    }

    previous(): void {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.showStep(this.currentStepIndex);
        }
    }

    end(): void {
        this.uiHandler.clear();
        this.currentStepIndex = 0;
    }


    public shouldTrigger():boolean{
        if(this.currentStepIndex < this.steps.length){
            return this.steps[this.currentStepIndex].shouldTrigger();
        }  
        return false;
    }

    private showStep(index: number): void {
        const step = this.steps[index];
        if(step.shouldTrigger()){
            this.uiHandler.showStep(step.action, this.next.bind(this));
        }
    }
}
