import { Component, Node, Vec3, _decorator, Camera, EventTarget, Size, Rect, misc, Vec2, tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    @property
    private targets: Node[] = []; // 可以跟踪多个目标
    @property
    targetPosition:Vec3|null = null; //focus位置
    @property
    smoothTime: number = 0.1;

    @property
    deadZoneWidth: number = 100;

    @property
    deadZoneHeight: number = 100;

    public eventTarget: EventTarget = new EventTarget();

    private camera: Camera | null = null;

    private mapSize: Size = new Size(0, 0);
    private viewportSize: Size = new Size(0, 0);
    private boundaryArea: Rect | null = null;
    private halfDeadZoneWidth: number = 0;
    private halfDeadZoneHeight: number = 0;
    
    private frameCount: number = 0;


    private prevTargetPosition: Vec3 = new Vec3(Number.MAX_VALUE, Number.MAX_VALUE); //目标之前位置
    private targetPositionLastStop: Vec3 = new Vec3(Number.MAX_VALUE, Number.MAX_VALUE);//目标上次停止移动位置

    private prevCameraPosition: Vec2 = new Vec2();//相机之前位置
    private targetCameraPosition: Vec2 = new Vec2();//相机目标位置
    

    start() {
        this.camera = this.getComponent(Camera);
        if (!this.camera) {
            console.error("未在此节点上找到 Camera 组件。");
            return;
        }

        this.halfDeadZoneWidth = this.deadZoneWidth * 0.5;
        this.halfDeadZoneHeight = this.deadZoneHeight * 0.5;
        
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
        this.targetPosition = position;
    }

    public setTargets(targets: Node[]): void {
        this.targets = targets;
    }

    public setTarget(target:Node):void{
        this.targets = [target];
    }

    private getTargetPosition(): Vec3 {
        if (this.targets.length === 0) {
            return this.targetPosition;
        }
        if (this.targets.length === 1){
            return this.targets[0].position
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

        this.frameCount++;
        if (this.frameCount % 2 !== 0) return; // 每两帧更新一次

        const targetPosition = this.getTargetPosition();


        if (!this.prevTargetPosition.equals(targetPosition)){ //目标变化了
            this.prevTargetPosition.set(targetPosition);
             //         // 计算目标移动的距离
            const delta = targetPosition.subtract(this.targetPositionLastStop);

            console.log("delta",delta.x,delta.y)
            
            // 检查目标是否超出死区, 超出则需要跟踪
            const isOutDeadZone = Math.abs(delta.x) > this.halfDeadZoneWidth || Math.abs(delta.y) > this.halfDeadZoneHeight;
    
            if(isOutDeadZone){
                this.targetCameraPosition.x = misc.clampf(targetPosition.x, this.boundaryArea.xMin, this.boundaryArea.xMax);
                this.targetCameraPosition.y = misc.clampf(targetPosition.y, this.boundaryArea.yMin, this.boundaryArea.yMax);
            }
        }
       

        if (!this.prevCameraPosition.equals(this.targetCameraPosition)) {
            let cameraPosition = new Vec2(this.node.position.x, this.node.position.y);
            const smoothPosition = cameraPosition.lerp(this.targetCameraPosition, this.smoothTime);
            this.node.setPosition(smoothPosition.x,smoothPosition.y);
            this.eventTarget.emit('camera-moved', targetPosition);
           
            this.prevCameraPosition.set(smoothPosition);
            console.log("相机位置",this.node.position)
        }else{//相机已经跟随完毕，设置新停留位置
            this.targetPositionLastStop.set(targetPosition); //设置 目标位置
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
//     private prevCameraPosition: Vec3 = new Vec3();
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
//         this.prevCameraPosition.set(this.node.worldPosition);
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

//             const deltaCamera = this.node.worldPosition.subtract(this.prevCameraPosition);

//             if( Math.abs(deltaCamera.x) > 1 || Math.abs(deltaCamera.y) > 1){ // 相机移动超过1个像素，则触发事件
//                 this.eventTarget.emit('camera-moved', this.node.worldPosition);
//                 this.prevCameraPosition.set(this.node.worldPosition);
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
