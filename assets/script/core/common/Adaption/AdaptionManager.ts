import { ResolutionPolicy, sys } from 'cc';
import { _decorator, Component, Node, EventTarget, Rect, Size, view, screen, UITransform, Vec3, log } from 'cc';

const { ccclass } = _decorator;

export enum UIPosition {
    Center = 'Center',
    TopLeft = 'TopLeft',
    BottomLeft = 'BottomLeft',
    TopRight = 'TopRight',
    BottomRight = 'BottomRight'
}

// 2D 坐标系:
// X 轴: 从左到右为正方向
// Y 轴: 从下到上为正方向
// 原点(0,0): 默认在屏幕左下角
// 3D 坐标系:
// X 轴: 从左到右为正方向
// Y 轴: 从下到上为正方向
// Z 轴: 从屏幕内向外为正方向
// 原点(0,0,0): 默认在场景中心

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
    private rootNodes: Map<Node, UIPosition> = new Map();

    private constructor() {
        super();
        this.updateDesignSize();
        this.updateSafeArea();
        // view.on("canvas-resize", () => {  // 画布大小变化   OK
        //     console.log("canvas-resize");
        // }, this);
        // screen.on("fullscreen-change", () => {
        //     console.log("fullscreen-change");
        // }, this);
        screen.on("orientation-change", () => {
            console.log("orientation-change");
        }, this);
        
        screen.on('window-resize', this.onWindowResize, this); //屏幕大小变化   OK
    }

   
    private onWindowResize = () => {
        console.log('window-resize');
        this.updateSafeArea();
        this.adaptRootNodes();
        // setTimeout(() => {
        //     this.adaptRootNodes();
        // }, 2000);
        this.emit('adaption-updated', 'window-resize');
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

        view.setDesignResolutionSize(this.designSize.width, this.designSize.height, this.isFixedHeight? ResolutionPolicy.FIXED_HEIGHT : ResolutionPolicy.FIXED_WIDTH);

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

    public getActualDesignPosition(designX: number, designY: number): Vec3 {
        return new Vec3(designX - this.safeArea.x, designY - this.safeArea.y, 0);
    }

    public getActualScreenPosition(designX: number, designY: number): Vec3 {
        const actualPos = this.getActualDesignPosition(designX, designY);
        return new Vec3(actualPos.x * this.designToScreenRatio, actualPos.y * this.designToScreenRatio, 0);
    }

    public setNodePosition(node: Node, designX: number, designY: number): void {
        const actualPosition = this.getActualDesignPosition(designX, designY);
        node.setPosition(actualPosition);
    }

    public forceAdaption(): void {
        this.updateDesignSize();
        this.updateSafeArea();
        this.adaptRootNodes();
        this.emit('adaption-updated', 'force');
    }

    private adaptRootNodes(): void {
        this.rootNodes.forEach((anchorPoint, rootNode) => {
            console.log(`adapt root node: ${anchorPoint}`, rootNode);
            this.adaptRootNode(rootNode, anchorPoint);
        });
    }

    public adaptRootNode(rootNode: Node, anchorPoint: UIPosition): void {
        const uiTransform = rootNode.getComponent(UITransform);
        if (uiTransform) {
            uiTransform.setContentSize(this.safeArea.width, this.safeArea.height);
            this.setNodePositionByAnchor(rootNode, anchorPoint);
        }
    }


    // export enum UIPosition {
    //     Center = 'Center',
    //     TopLeft = 'TopLeft',
    //     BottomLeft = 'BottomLeft',
    //     TopRight = 'TopRight',
    //     BottomRight = 'BottomRight'
    // }
    
    // // 2D 坐标系:
    // // X 轴: 从左到右为正方向
    // // Y 轴: 从下到上为正方向
    // // 原点(0,0): 默认在屏幕左下角
    // // 3D 坐标系:
    // // X 轴: 从左到右为正方向
    // // Y 轴: 从下到上为正方向
    // // Z 轴: 从屏幕内向外为正方向
    // // 原点(0,0,0): 默认在场景中心

    //中心原点(0,0,0)坐标系
    private setNodePositionByAnchor(node: Node, anchorPoint: UIPosition): void {
        let x = 0;
        let y = 0;

        switch (anchorPoint) {
            case UIPosition.Center:
                // Center is default (x, y)
                break;
            case UIPosition.TopLeft:
                x -= this.safeArea.width/2;
                y += this.safeArea.height/2;
                break;
            case UIPosition.TopRight:
                x += this.safeArea.width/2;
                y += this.safeArea.height/2;
                break;
            case UIPosition.BottomRight:
                x += this.safeArea.width/2;
                y -= this.safeArea.height/2;
                break;
            case UIPosition.BottomLeft:
                x -= this.safeArea.width/2;
                y -= this.safeArea.height/2;
                break;
        }

        node.setPosition(new Vec3(x, y, 0));

        console.log(`${node.name} :set node position: ${anchorPoint}`, node.getPosition(),view.getResolutionPolicy());
    }

    public addRootNode(node: Node, anchorPoint: UIPosition = UIPosition.Center): void {
        if(!node||!node.isValid){
            log(`addRootNode failed, node is invalid: ${node}`);
            return;
        }
        if (!this.rootNodes.has(node)) {
            this.rootNodes.set(node, anchorPoint);
            this.adaptRootNode(node, anchorPoint);
        }
    }

    public removeRootNode(node: Node): void {
        this.rootNodes.delete(node);
    }

    public getNodeAnchorPoint(node: Node): UIPosition | undefined {
        return this.rootNodes.get(node);
    }

    public getAllRootNodes(): IterableIterator<Node> {
        return this.rootNodes.keys();
    }

    public destroy(): void {
        screen.off('window-resize', this.onWindowResize, this);
        this.rootNodes.clear();
        AdaptionManager.instance = null;
    }
}






















// private setNodePositionByAnchor2D(node: Node, anchorPoint: UIPosition): void {
//     let x = this.safeArea.x;
//     let y = this.safeArea.y;

//     switch (anchorPoint) {
//         case UIPosition.Center:
//             x += this.safeArea.width / 2;
//             y += this.safeArea.height / 2;
//             break;
//         case UIPosition.TopLeft:
//             y += this.safeArea.height;
//             break;
//         case UIPosition.TopRight:
//             x += this.safeArea.width;
//             y += this.safeArea.height;
//             break;
//         case UIPosition.BottomRight:
//             x += this.safeArea.width;
//             break;
//         // BottomLeft is default (x, y)
//     }

//     node.setPosition(new Vec3(x, y, 0));

//     console.log(`${node.name} set node position: ${anchorPoint}`, node.getPosition());
// }