// FairyGUIGuideUIHandler.ts

import { Event, GComponent, GGraph, GObject, GTextField } from "fairygui-cc";
import { BaseGuideUIHandler } from "./GuideUIHandler";
import { Vec2 } from "cc";

export class FairyGUIGuideUIHandler extends BaseGuideUIHandler {
    private root: GComponent;
    private mask: GGraph | null = null;
    private messageNode: GTextField | null = null;
    private indicatorNode: GObject | null = null;

    constructor(root: GComponent) {
        super();
        this.root = root;
    }


    protected clearMask(): void {
        if (this.mask) {
            this.root.removeChild(this.mask);
            this.mask.dispose();
            this.mask = null;
        }
    }

    protected showMessage(message: string, position: { x: number, y: number }): void {
        this.messageNode = new GTextField();
        this.messageNode.text = message;
        this.messageNode.setPosition(position.x, position.y);
        this.root.addChild(this.messageNode);
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
        this.root.onClick((event: Event) => {
            const touchLoc = event.pos;
            if (Math.sqrt((touchLoc.x - target.x) ** 2 + (touchLoc.y - target.y) ** 2) < 50) { // 假设点击区域半径为50
                onComplete();
            }
        }, this);
    }

    protected setupSwipeListener(start: { x: number, y: number }, end: { x: number, y: number }, onComplete: () => void): void {

    }
}