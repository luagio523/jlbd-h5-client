import { GuideAction } from "./GuideAction";


export class GuideStep {
    id: string;
    condition: () => boolean;
    action: GuideAction;
    isForced: boolean;

    constructor(config: {
        id: string;
        action: GuideAction;
        condition: () => boolean;
        isForced?: boolean;
    }) {
        this.id = config.id;
        this.action = config.action;
        this.condition = this.condition;
        this.isForced = config.isForced || false;
    }

    shouldTrigger(): boolean {
        return  this.condition();
    }
}

