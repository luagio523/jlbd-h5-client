import { _decorator, view, screen, UITransform, Node, Size, Rect, sys, EventTarget, log } from "cc";

const { ccclass, property } = _decorator;
/**
 * 适配管理器
 * 不出现黑边的方式fixedHeight或是fixedWidth，取决于设计分辨率的宽高比和屏幕的宽高比。
 */
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
    private designToScreenRatio: number = 1; // 设计分辨率 到 屏幕分辨率 的缩放比例
    private designSize: Size = new Size();
    private rootNodes: Node[] = [];

    private constructor() {
        super();
        this.updateDesignSize();
        this.updateSafeArea();
        
        view.on('design-resolution-changed', this.onDesignResolutionChanged, this);
        view.on('window-resize', this.onWindowResize, this);
        view.on('orientation-change', this.onOrientationChange, this);
        //fullscreen-change
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
        // 计算设计分辨率下的安全区域
        const visibleWidth = screenSize.width / scale;
        const visibleHeight = screenSize.height / scale;

        this.safeArea.set(
            (this.designSize.width - visibleWidth) * 0.5,
            (this.designSize.height - visibleHeight) * 0.5,
            this.safeArea.width = visibleWidth,
            this.safeArea.height = visibleHeight
        );

        console.log(`designSize: ${this.designSize.width}, ${this.designSize.height}`);
        console.log(`screenSize: ${screenSize.width}, ${screenSize.height}`);
        console.log(`isFixedHeight: ${this.isFixedHeight}`);
        console.log(`scale: ${scale}`);
        console.log(`safeArea: ${this.safeArea.x}, ${this.safeArea.y}, ${this.safeArea.width}, ${this.safeArea.height}`);
        // 考虑系统安全区域
        // const sysSafeArea = sys.getSafeAreaRect();
        // this.safeArea.intersects(sysSafeArea);
    }
    
    // safeArea: 0, 72, 1280, 576

    public getSafeArea(): Rect {
        return this.safeArea.clone();
    }
    public getSafeSize(): Size {
        return this.safeArea.size;
    }

    public isFixedHeightMode(): boolean {
        return this.isFixedHeight;
    }

     // 获取设计分辨率到屏幕分辨率的缩放比例
     public getDesignToScreenRatio(): number {
        return this.designToScreenRatio;
    }

    // 获取屏幕分辨率到设计分辨率的缩放比例
    public getScreenToDesignRatio(): number {
        return 1 / this.designToScreenRatio;
    }

    //获取设计分辨率下实际坐标
    public getActualDesignPosition(designX: number, designY: number): { x: number, y: number } {
        return {
            x: designX - this.safeArea.x,
            y: designY - this.safeArea.y
        };
    }

    // 获取设计分辨率下的坐标对应的屏幕坐标
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
        this.rootNodes.forEach(rootNode => {
            const uiTransform = rootNode.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.setContentSize(this.safeArea.width, this.safeArea.height);
                rootNode.setPosition(this.safeArea.x + this.safeArea.width / 2, this.safeArea.y + this.safeArea.height / 2);
            }
        });
    }

    
    public addRootNode(node: Node): void {
        if (!this.rootNodes.includes(node)) {
            this.rootNodes.push(node);
            this.adaptRootNodes();
        }
    }

    public removeRootNode(node: Node): void {
        const index = this.rootNodes.indexOf(node);
        if (index !== -1) {
            this.rootNodes.splice(index, 1);
        }
    }

    public destroy(): void {
        view.off('design-resolution-changed', this.onDesignResolutionChanged, this);
        view.off('window-resize', this.onWindowResize, this);
        view.off('orientation-change', this.onOrientationChange, this);
        this.rootNodes = [];
        AdaptionManager.instance = null;
    }

}