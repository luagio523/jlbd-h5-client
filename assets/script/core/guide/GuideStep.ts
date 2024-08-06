import { GuideAction } from "./GuideAction";
import { GuideTrigger } from "./GuideTrigger";

export class GuideStep {
    id: string;
    trigger?: GuideTrigger;
    action: GuideAction;
    isForced: boolean;
    isSavePoint: boolean;

    constructor(config: {
        id: string;
        action: GuideAction;
        trigger?: GuideTrigger;
        isForced?: boolean;
        isSavePoint?: boolean;
    }) {
        this.id = config.id;
        this.trigger = config.trigger;
        this.action = config.action;
        this.isForced = config.isForced || false;
        this.isSavePoint = config.isSavePoint || false;
    }

    shouldTrigger(): boolean {
        return this.isForced || (this.trigger ? this.trigger.check() : true);
    }
}
