// FairyGUIGuideUIHandler.ts

import { GComponent, GGraph, GObject, GTextField } from "fairygui-cc";
import {  GuideUIHandler } from "./GuideUIHandler";
import { GuideAction, GuideActionType } from "./GuideAction";

export class FairyGUIGuideUIHandler implements GuideUIHandler {
    protected onStepComplete: () => void;
    private root: GComponent;
    private mask: GGraph | null = null;
    private messageNode: GTextField | null = null;
    private indicatorNode: GObject | null = null;

    constructor(root: GComponent) {
        
    }


    public async showIndicator(action: GuideAction, onComplete: () => void): Promise<void> {
        this.clear();
        this.onStepComplete = onComplete;

        switch (action.type) {
            case GuideActionType.CLICK:
                break;
          
        }
    }

    public end(): void {
        if (this.onStepComplete) {
            this.onStepComplete();
            this.onStepComplete = null;
        }
    }

    clear(): void {
    }
}