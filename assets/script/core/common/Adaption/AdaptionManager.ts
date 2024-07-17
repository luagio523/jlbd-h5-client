import { _decorator, Component, Node, EventTarget, Rect, Size, view, screen, UITransform } from 'cc';

const { ccclass } = _decorator;

export enum UIAnchorPoint {
    Center = 'Center',
    TopLeft = 'TopLeft',
    BottomLeft = 'BottomLeft',
    TopRight = 'TopRight',
    BottomRight = 'BottomRight'
}

@ccclass('AdaptionManager')
export class AdaptionManager extends EventTarget {
    private static instance: AdaptionManager;

    public static getInstance(): AdaptionManager {
        if (!AdaptionManager.instance) {
            AdaptionManager.instance = new AdaptionManager();
        }
        return AdaptionManager.instance;
    }

    private safeArea: Rect = new Rect();
    private isFixedHeight: boolean = false;
    private designToScreenRatio: number = 1;
    private designSize: Size = new Size();
    private rootNodes: Map<UIAnchorPoint, Node> = new Map();

    private constructor() {
        super();
        this.updateDesignSize();
        this.updateSafeArea();
        
        view.on('design-resolution-changed', this.onDesignResolutionChanged, this);
        view.on('window-resize', this.onWindowResize, this);
        view.on('orientation-change', this.onOrientationChange, this);
    }

    private onDesignResolutionChanged = () => {
        console.log('design-resolution-changed');
        this.updateDesignSize();
        this.updateSafeArea();
        this.adaptRootNodes();
        this.emit('adaption-updated', 'design-resolution');
    }

    private onWindowResize = () => {
        console.log('window-resize');
        this.updateSafeArea();
        this.adaptRootNodes();
        this.emit('adaption-updated', 'window-resize');
    }

    private onOrientationChange = () => {
        console.log('orientation-change');
        this.updateSafeArea();
        this.adaptRootNodes();
        this.emit('adaption-updated', 'orientation-change');
    }

    private updateDesignSize(): void {
        this.designSize = view.getDesignResolutionSize();
    }

    private updateSafeArea(): void {
        const screenSize = screen.windowSize;
        const designRatio = this.designSize.width / this.designSize.height;
        const screenRatio = screenSize.width / screenSize.height;
    
        this.isFixedHeight = designRatio > screenRatio;
        const scale = this.isFixedHeight 
            ? screenSize.height / this.designSize.height 
            : screenSize.width / this.designSize.width;
        this.designToScreenRatio = scale;

        const visibleWidth = screenSize.width / scale;
        const visibleHeight = screenSize.height / scale;

        this.safeArea.set(
            (this.designSize.width - visibleWidth) * 0.5,
            (this.designSize.height - visibleHeight) * 0.5,
            visibleWidth,
            visibleHeight
        );

        console.log(`designSize: ${this.designSize.width}, ${this.designSize.height}`);
        console.log(`screenSize: ${screenSize.width}, ${screenSize.height}`);
        console.log(`isFixedHeight: ${this.isFixedHeight}`);
        console.log(`scale: ${scale}`);
        console.log(`safeArea: ${this.safeArea.x}, ${this.safeArea.y}, ${this.safeArea.width}, ${this.safeArea.height}`);
    }

    public getSafeArea(): Rect {
        return this.safeArea.clone();
    }

    public getSafeSize(): Size {
        return this.safeArea.size;
    }

    public isFixedHeightMode(): boolean {
        return this.isFixedHeight;
    }

    public getDesignToScreenRatio(): number {
        return this.designToScreenRatio;
    }

    public getScreenToDesignRatio(): number {
        return 1 / this.designToScreenRatio;
    }

    public getActualDesignPosition(designX: number, designY: number): { x: number, y: number } {
        return {
            x: designX - this.safeArea.x,
            y: designY - this.safeArea.y
        };
    }

    public getActualScreenPosition(designX: number, designY: number): { x: number, y: number } {
        const actualPos = this.getActualDesignPosition(designX, designY);
        return {
            x: actualPos.x * this.designToScreenRatio,
            y: actualPos.y * this.designToScreenRatio
        };
    }

    public setNodePosition(node: Node, designX: number, designY: number): void {
        const actualPosition = this.getActualDesignPosition(designX, designY);
        node.setPosition(actualPosition.x, actualPosition.y);
    }

    public forceAdaption(): void {
        this.updateDesignSize();
        this.updateSafeArea();
        this.adaptRootNodes();
        this.emit('adaption-updated', 'force');
    }

    private adaptRootNodes(): void {
        this.rootNodes.forEach((rootNode, anchorPoint) => {
            const uiTransform = rootNode.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.setContentSize(this.safeArea.width, this.safeArea.height);
                this.setNodePositionByAnchor(rootNode, anchorPoint);
            }
        });
    }

    private setNodePositionByAnchor(node: Node, anchorPoint: UIAnchorPoint): void {
        let x = this.safeArea.x;
        let y = this.safeArea.y;

        switch (anchorPoint) {
            case UIAnchorPoint.Center:
                x += this.safeArea.width / 2;
                y += this.safeArea.height / 2;
                break;
            case UIAnchorPoint.TopLeft:
                y += this.safeArea.height;
                break;
            case UIAnchorPoint.TopRight:
                x += this.safeArea.width;
                y += this.safeArea.height;
                break;
            case UIAnchorPoint.BottomRight:
                x += this.safeArea.width;
                break;
            // BottomLeft is default (x, y)
        }

        node.setPosition(x, y);
    }

    public addRootNode(node: Node,anchorPoint?: UIAnchorPoint): void {
        anchorPoint = anchorPoint || UIAnchorPoint.Center;
        if (!this.rootNodes.has(anchorPoint)) {
            this.rootNodes.set(anchorPoint, node);
            this.adaptRootNodes();
        }
    }

    public removeRootNode(anchorPoint: UIAnchorPoint): void {
        this.rootNodes.delete(anchorPoint);
    }

    public getRootNode(anchorPoint: UIAnchorPoint): Node | undefined {
        return this.rootNodes.get(anchorPoint);
    }

    public destroy(): void {
        view.off('design-resolution-changed', this.onDesignResolutionChanged, this);
        view.off('window-resize', this.onWindowResize, this);
        view.off('orientation-change', this.onOrientationChange, this);
        this.rootNodes.clear();
        AdaptionManager.instance = null;
    }
}