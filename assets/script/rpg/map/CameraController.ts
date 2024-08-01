import { Component, Node, Vec3, _decorator, Camera, EventTarget, Size, Rect, misc, Vec2, tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    @property(Node)
    target: Node | null = null;

    @property
    smoothTime: number = 0.1;

    @property
    deadZoneWidth: number = 100;

    @property
    deadZoneHeight: number = 100;

    private camera: Camera | null = null;
    private velocity: Vec3 = new Vec3();
    private lastTargetPosition: Vec3 = new Vec3();
    public eventTarget: EventTarget = new EventTarget();
    private mapSize: Size = new Size(0, 0);
    private viewportSize: Size = new Size(0, 0);
    private boundaryArea: Rect | null = null;
    private halfDeadZoneWidth: number = 0;
    private halfDeadZoneHeight: number = 0;
    private lastCameraPosition: Vec3 = new Vec3();
    private tempVec3: Vec3 = new Vec3();
    private frameCount: number = 0;

    private targets: Node[] = []; // 可以跟踪多个目标

    start() {
        this.camera = this.getComponent(Camera);
        if (!this.camera) {
            console.error("未在此节点上找到 Camera 组件。");
            return;
        }

        if (this.target) {
            this.lastTargetPosition.set(this.target.worldPosition);
        }

        this.halfDeadZoneWidth = this.deadZoneWidth * 0.5;
        this.halfDeadZoneHeight = this.deadZoneHeight * 0.5;
        this.lastCameraPosition.set(this.node.worldPosition);
    }

    /**************************区域限制******************************** */

    public setMapSize(width: number, height: number): void {
        this.mapSize.width = width;
        this.mapSize.height = height;
        this.updateBoundaryFromSizes();
    }

    public setViewportSize(width: number, height: number): void {
        this.viewportSize.width = width;
        this.viewportSize.height = height;
        this.updateBoundaryFromSizes();
    }

    /**
     * 直接提供设置好的边界
     * @param boundaryArea 
     */
    public setBoundaryArea(boundaryArea: Rect): void {
        this.boundaryArea = boundaryArea;
    }

    private updateBoundaryFromSizes(): void {
        if (!this.boundaryArea && this.mapSize.width > 0 && this.mapSize.height > 0 && this.viewportSize.width > 0 && this.viewportSize.height > 0) {
            const halfViewportWidth = this.viewportSize.width * 0.5;
            const halfViewportHeight = this.viewportSize.height * 0.5;
            this.boundaryArea = new Rect(
                halfViewportWidth,
                halfViewportHeight,
                this.mapSize.width - this.viewportSize.width,
                this.mapSize.height - this.viewportSize.height
            );
        }
    }

    public setTargetPosition(position: Vec3): void {
        if (this.target) {
            this.target.setWorldPosition(position);
        } else if (this.targets.length > 0) {
            // 移动所有目标相同的偏移量
            const offset = position.subtract(this.getTargetPosition());
            this.targets.forEach(target => {
                target.setWorldPosition(target.worldPosition.add(offset));
            });
        }
    }

    public setTargets(targets: Node[]): void {
        this.targets = targets;
    }

    private getTargetPosition(): Vec3 {
        if (this.targets.length === 0) {
            return this.target ? this.target.position : this.node.position;
        }
        const avgPos = new Vec3();
        this.targets.forEach(target => avgPos.add(target.position));
        return avgPos.divide3f(this.targets.length, this.targets.length, this.targets.length);
    }

    public clearTargets(): void {
        this.targets = [];
    }

    lateUpdate(dt: number) {
        if (!this.camera || !this.boundaryArea) return;

        // this.frameCount++;
        // if (this.frameCount % 20 !== 0) return; // 每两帧更新一次

        const targetPosition = this.getTargetPosition();
        let cameraPosition = this.node.position.clone();

        const cameraX = misc.clampf(targetPosition.x, this.boundaryArea.xMin, this.boundaryArea.xMax);
        const cameraY = misc.clampf(targetPosition.y, this.boundaryArea.yMin, this.boundaryArea.yMax);
        const clampedTargetPosition = new Vec3(cameraX, cameraY, cameraPosition.z);

        // Smoothly interpolate the camera position towards the target position
        const smoothPosition = cameraPosition.lerp(clampedTargetPosition, this.smoothTime);
    
        // Set the camera's position
        this.node.setPosition(smoothPosition);
    
        // Emit event if the camera position has changed
        if (!this.lastCameraPosition.equals(smoothPosition)) {
            this.eventTarget.emit('camera-moved', targetPosition);
            this.lastCameraPosition.set(smoothPosition);
        }
      
    }

   

    public onCameraMoved(callback: (position: Vec3) => void): void {
        this.eventTarget.on('camera-moved', callback);
    }

    public offCameraMoved(callback: (position: Vec3) => void): void {
        this.eventTarget.off('camera-moved', callback);
    }
}



















// import { Component, Node, Vec3, _decorator, Camera, EventTarget, Size, Rect, misc } from 'cc';

// const { ccclass, property } = _decorator;

// @ccclass('CameraController')
// export class CameraController extends Component {
//     @property(Node)
//     target: Node | null = null;

//     @property
//     smoothTime: number = 0.3;

//     @property
//     deadZoneWidth: number = 100;

//     @property
//     deadZoneHeight: number = 100;

//     private camera: Camera | null = null;
//     private targetPositionLastStop: Vec3 = new Vec3(); //表示 上一次停止的目标位置
//     public eventTarget: EventTarget = new EventTarget();
//     private mapSize: Size = new Size(0, 0);
//     private viewportSize: Size = new Size(0, 0);
//     private boundaryArea: Rect | null = null;
//     private halfDeadZoneWidth: number = 0;
//     private halfDeadZoneHeight: number = 0;
//     private lastCameraPosition: Vec3 = new Vec3();
//     private frameCount: number = 0;

//     private targets: Node[] = []; // 可以跟踪多个目标

//     start() {
//         this.camera = this.getComponent(Camera);
//         if (!this.camera) {
//             console.error("未在此节点上找到 Camera 组件。");
//             return;
//         }

//         if (this.target) {
//             this.targetPositionLastStop.set(this.target.worldPosition);
//         }

//         this.halfDeadZoneWidth = this.deadZoneWidth * 0.5;
//         this.halfDeadZoneHeight = this.deadZoneHeight * 0.5;
//         this.lastCameraPosition.set(this.node.worldPosition);
//     }

//     /**************************区域限制******************************** */

//     public setMapSize(width: number, height: number): void {
//         this.mapSize.width = width;
//         this.mapSize.height = height;
//         this.updateBoundaryFromSizes();
//     }

//     public setViewportSize(width: number, height: number): void {
//         this.viewportSize.width = width;
//         this.viewportSize.height = height;
//         this.updateBoundaryFromSizes();
//     }

//     /**
//      * 直接提供设置好的边界
//      * @param boundaryArea 
//      */
//     public setBoundaryArea(boundaryArea: Rect): void {
//         this.boundaryArea = boundaryArea;
//     }

//     private updateBoundaryFromSizes(): void {
//         if (!this.boundaryArea && this.mapSize.width > 0 && this.mapSize.height > 0 && this.viewportSize.width > 0 && this.viewportSize.height > 0) {
//             const halfViewportWidth = this.viewportSize.width * 0.5;
//             const halfViewportHeight = this.viewportSize.height * 0.5;
//             this.boundaryArea = new Rect(
//                 halfViewportWidth,
//                 halfViewportHeight,
//                 this.mapSize.width - this.viewportSize.width,
//                 this.mapSize.height - this.viewportSize.height
//             );
//         }
//     }

//     public setTargetPosition(position: Vec3): void {
//         if (this.target) {
//             this.target.setWorldPosition(position);
//         } else if (this.targets.length > 0) {
//             // 移动所有目标相同的偏移量
//             const offset = position.subtract(this.getTargetPosition());
//             this.targets.forEach(target => {
//                 target.setWorldPosition(target.worldPosition.add(offset));
//             });
//         }
//     }

//     public setTargets(targets: Node[]): void {
//         this.targets = targets;
//     }

//     private getTargetPosition(): Vec3 {
//         if (this.targets.length === 0) {
//             return this.target ? this.target.worldPosition : this.node.worldPosition;
//         }
//         const avgPos = new Vec3();
//         this.targets.forEach(target => avgPos.add(target.worldPosition));
//         return avgPos.divide3f(this.targets.length, this.targets.length, this.targets.length);
//     }

//     public clearTargets(): void {
//         this.targets = [];
//     }

//     lateUpdate(dt: number) {
//         if (!this.camera || !this.boundaryArea) return;

//         this.frameCount++;
//         if (this.frameCount % 2 !== 0) return; // 每两帧更新一次

//         const targetPosition = this.getTargetPosition();

//         targetPosition.x = misc.clampf(targetPosition.x, this.boundaryArea.xMin, this.boundaryArea.xMax);
//         targetPosition.y = misc.clampf(targetPosition.y, this.boundaryArea.yMin, this.boundaryArea.yMax);

//         // 计算目标移动的距离
//         const delta = targetPosition.subtract(this.targetPositionLastStop);
        

//         // 检查目标是否超出死区, 超出则需要跟踪
//         const shouldCameraFollow = Math.abs(delta.x) > this.halfDeadZoneWidth || Math.abs(delta.y) > this.halfDeadZoneHeight;
//         // 检查是否超出死区 //相机需要移动
//         if (shouldCameraFollow) {
//             // this.smoothCameraFollow(targetPosition,dt)

//             this.node.setWorldPosition(targetPosition);

//             const deltaCamera = this.node.worldPosition.subtract(this.lastCameraPosition);

//             if( Math.abs(deltaCamera.x) > 1 || Math.abs(deltaCamera.y) > 1){ // 相机移动超过1个像素，则触发事件
//                 this.eventTarget.emit('camera-moved', this.node.worldPosition);
//                 this.lastCameraPosition.set(this.node.worldPosition);
//                 console.log('相机移动', this.node.worldPosition);
//             }else{
//                 // 表示相机位置没有变化，则不触发事件
//                 this.targetPositionLastStop.set(targetPosition); //设置 目标位置
//             }
//         }
//     }

    

//     private smoothCameraFollow(targetPosition: Vec3, deltaTime: number) {
//         // 计算新的摄像机位置
//         const targetCameraPosition = new Vec3(targetPosition.x, targetPosition.y, this.node.worldPosition.z);
        
//         // 使用线性插值进行平滑移动
//         Vec3.lerp(this.node.worldPosition, this.node.worldPosition, targetCameraPosition, this.smoothTime * deltaTime);
        
//         // 更新摄像机位置
//         this.node.setWorldPosition(this.node.worldPosition);

//     }
   

//     public onCameraMoved(callback: (position: Vec3) => void): void {
//         this.eventTarget.on('camera-moved', callback);
//     }

//     public offCameraMoved(callback: (position: Vec3) => void): void {
//         this.eventTarget.off('camera-moved', callback);
//     }
// }
