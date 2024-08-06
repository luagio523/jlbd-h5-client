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

    constructor() {
        
    }

    /**
     * 引导UI 可以包含所有的引导元素，比如提示信息，指示器，蒙版等
     * @returns 
     */
    private async createGuideUI(): Promise<void> {
        return ;
    }


    public async showIndicator(action: GuideAction, onComplete: () => void): Promise<void> {
        await this.createGuideUI();
        this.clear();
        this.onStepComplete = onComplete;

        switch (action.type) {
            case GuideActionType.CLICK:
                break;
          
        }
    }
    

    clear(): void {
    }
}