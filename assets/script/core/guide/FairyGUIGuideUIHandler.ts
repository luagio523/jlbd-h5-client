// FairyGUIGuideUIHandler.ts

import { Event, GComponent, GGraph, GObject, GTextField } from "fairygui-cc";
import { Vec2 } from "cc";
import { FairyUIAdapter } from "../ui/UIAdapter";
import { GuideUIHandler } from "./GuideUIHandler";
import { GuideAction, GuideActionType } from "./GuideAction";

export class FairyGUIGuideUIHandler extends FairyUIAdapter implements GuideUIHandler {
    protected onStepComplete: () => void;
    private mask: GGraph | null = null;
    private messageNode: GTextField | null = null;
    private indicatorNode: GObject | null = null;

    
    public injectUI(ui: GComponent): void {
        super.injectUI(ui);
    }

    
    public showStep(action: GuideAction, onComplete: () => void): void {
        this.clear();
        this.onStepComplete = onComplete;

        switch (action.type) {
            case GuideActionType.CLICK:
                this.showClickIndicator(action.data.target);
                break;
            case GuideActionType.SWIPE:
                this.showSwipeIndicator(action.data.start, action.data.end);
                break;
        }
    }

    public endStep(): void {
        if (this.onStepComplete) {
            this.onStepComplete();
            this.onStepComplete = null;
        }
    }

    public clear(): void {
        this.clearIndicators();
    }


   
    protected showClickIndicator(target: string | { x: number, y: number }): void {
        // this.createMask(target); // 创建遮罩并挖孔

        // if (typeof target === 'string') {
        //   const targetComponent = this.root.getChild(target);
        //   if (targetComponent) {
        //     this.indicatorNode = UIPackage.createObject('YourPackage', 'ClickIndicator');
        //     this.indicatorNode.setPosition(targetComponent.x, targetComponent.y);
        //     this.root.addChild(this.indicatorNode);
        //   }
        // } else {
        //   this.indicatorNode = UIPackage.createObject('YourPackage', 'ClickIndicator');
        //   this.indicatorNode.setPosition(target.x, target.y);
        //   this.root.addChild(this.indicatorNode);
        // }
    }

    protected showSwipeIndicator(start: { x: number, y: number }, end: { x: number, y: number }): void {
        // this.indicatorNode = UIPackage.createObject('YourPackage', 'SwipeIndicator');
        // const graph = this.indicatorNode.asGraph;
        // graph.drawLine(start.x, start.y, end.x, end.y, 2, new Color4(255, 255, 255, 1));
        // this.root.addChild(this.indicatorNode);
    }

    protected clearIndicators(): void {
        // if (this.messageNode) {
        //   this.root.removeChild(this.messageNode);
        //   this.messageNode.dispose();
        //   this.messageNode = null;
        // }
        // if (this.indicatorNode) {
        //   this.root.removeChild(this.indicatorNode);
        //   this.indicatorNode.dispose();
        //   this.indicatorNode = null;
        // }
    }

    protected setupClickListener(target: Vec2, onComplete: () => void): void {
        // this.root.onClick((event: Event) => {
        //     const touchLoc = event.pos;
        //     if (Math.sqrt((touchLoc.x - target.x) ** 2 + (touchLoc.y - target.y) ** 2) < 50) { // 假设点击区域半径为50
        //         onComplete();
        //     }
        // }, this);
    }

    protected setupSwipeListener(start: { x: number, y: number }, end: { x: number, y: number }, onComplete: () => void): void {

    }
}