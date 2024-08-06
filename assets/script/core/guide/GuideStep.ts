import { GuideAction } from "./GuideAction";
import { GuideTrigger } from "./GuideTrigger";

export class GuideStep {
    id: string;
    trigger?: GuideTrigger;
    action: GuideAction;

    constructor(config: {
        id: string;
        action: GuideAction;
        trigger?: GuideTrigger;
    }) {
        this.id = config.id;
        this.trigger = config.trigger;
        this.action = config.action;
    }

    shouldTrigger(): boolean {
        return this.trigger ? this.trigger.check() : true;
    }
}
