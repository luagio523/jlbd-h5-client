// GuideManager.ts
import { ConfigManager } from '../common/config/ConfigManager';
import { Guide } from './Guide';
import { GuideStep } from './GuideStep';
import { GuideUIHandler } from './GuideUIHandler';

export class GuideManager {
    private guides: Map<string, Guide> = new Map();
    private uiHandler: GuideUIHandler;

    constructor(uiHandler:GuideUIHandler) {
        this.uiHandler = uiHandler;
    }

    public async loadGuide(id: string): Promise<void> {
        let config = await ConfigManager.getInstance().loadJSON( id )

        const steps = config.steps.map((stepData: any) => new GuideStep(stepData));
        const guide = new Guide(id, steps, config.isForced, this.uiHandler);
        this.guides.set(id, guide);
    }

    public startGuide(id: string): void {
        const guide = this.guides.get(id);
        if (guide) {
            guide.start();
        }
    }

    public nextStep(id: string): void {
        const guide = this.guides.get(id);
        if (guide) {
            guide.next();
        }
    }

    public previousStep(id: string): void {
        const guide = this.guides.get(id);
        if (guide && !guide.isForced) {
            guide.previous();
        }
    }

    public endGuide(id: string): void {
        const guide = this.guides.get(id);
        if (guide && !guide.isForced) {
            guide.end();
        }
    }

    public checkAndTriggerGuides(): void {
        this.guides.forEach(guide => {
            if (!guide.isForced && guide.shouldTrigger()) {
                guide.start();
            }
        });
    }
}


