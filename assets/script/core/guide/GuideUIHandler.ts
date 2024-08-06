// GuideUIHandler.ts

import { GuideAction, GuideActionType } from "./GuideAction";

export interface GuideUIHandler {
    showIndicator(action: GuideAction, onComplete: () => void): void;
    end(): void;
    clear(): void;
}


// export abstract class BaseGuideUIHandler {
//     protected onStepComplete: () => void;

//     protected abstract showMessage(message: string, position: { x: number, y: number }): void;
//     protected abstract showClickIndicator(target: string | { x: number, y: number }): void;
//     protected abstract showSwipeIndicator(start: { x: number, y: number }, end: { x: number, y: number }): void;
//     protected abstract clearIndicators(): void;

//     async showStep(action: GuideAction, onComplete: () => void): Promise<void> {
//         this.clear();
//         this.onStepComplete = onComplete;

//         switch (action.type) {
//             case GuideActionType.SHOW_MESSAGE:
//                 this.showMessage(action.data.message, action.data.position);
//                 break;
//             case GuideActionType.CLICK:
//                 this.showClickIndicator(action.data.target);
//                 break;
//             case GuideActionType.SWIPE:
//                 this.showSwipeIndicator(action.data.start, action.data.end);
//                 break;
//         }
//     }

//     endStep(): void {
//         if (this.onStepComplete) {
//             this.onStepComplete();
//             this.onStepComplete = null;
//         }
//     }

//     clear(): void {
//         this.clearIndicators();
//     }
    
// }