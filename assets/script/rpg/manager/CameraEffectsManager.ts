import { Node, Vec3, tween, Tween, Camera } from 'cc';
import { CameraController } from '../map/CameraController';
import { SceneTour } from '../map/SceneTour';
import { FogOfWar } from '../map/FogOfWar';

export class CameraEffectsManager {

    private static instance: CameraEffectsManager;

    private cameraController: CameraController;
    private cameraNode: Node;
    private camera: Camera;
    private shakeOffset: Vec3 = new Vec3();
    private shakeTween: Tween<Vec3> | null = null;
    private fogOfWar: FogOfWar | null = null;


    public static getInstance(): CameraEffectsManager {
        if (!CameraEffectsManager.instance) {
            CameraEffectsManager.instance = new CameraEffectsManager();
        }
        return CameraEffectsManager.instance;
    }


    public initialize(cameraController: CameraController) {
        this.cameraController = cameraController;
        this.cameraNode = cameraController.node;
        this.camera = this.cameraNode.getComponent(Camera)!;
    }
    

    
    public initFogOfWar(mapWidth: number, mapHeight: number): void {
        this.fogOfWar = new FogOfWar();
        this.fogOfWar.init(this.cameraNode, mapWidth, mapHeight);
    }

    public revealFogArea(center: Vec3, radius: number): void {
        this.fogOfWar?.revealArea(center, radius);
    }

    public setFogVisible(visible: boolean): void {
        this.fogOfWar?.setVisible(visible);
    }

    /**
     * 晃动
     * @param duration 
     * @param intensity 
     */
    public shake(duration: number, intensity: number): void {
        if (this.shakeTween) {
            this.shakeTween.stop();
        }

        this.shakeOffset.set(Vec3.ZERO);
        this.shakeTween = tween(this.shakeOffset)
            .to(duration, new Vec3(intensity, intensity, 0), {
                onUpdate: (target: Vec3) => {
                    const randomOffset = new Vec3(
                        (Math.random() - 0.5) * 2 * target.x,
                        (Math.random() - 0.5) * 2 * target.y,
                        0
                    );
                    this.cameraNode.position = this.cameraNode.position.add(randomOffset);
                }
            })
            .call(() => {
                this.shakeOffset.set(Vec3.ZERO);
                this.shakeTween = null;
            })
            .start();
    }

    /**
     * 爆炸效果
     * @param duration 
     * @param intensity 
     */
    public explosion(duration: number, intensity: number): void {
        const originalScale = this.cameraNode.scale.clone();
        const originalPosition = this.cameraNode.position.clone();
    
        tween(this.cameraNode)
            .to(duration / 2, { scale: new Vec3(1.1, 1.1, 1) })
            .to(duration / 2, { scale: originalScale })
            .start();
    
        this.shake(duration, intensity);
    
        this.cameraNode.position = originalPosition;
    }
    
    // 缩放效果
    public zoom(scale: number, duration: number = 0.3): void {
        tween(this.camera)
            .to(duration, { orthoHeight: this.camera.orthoHeight / scale })
            .start();
    }

    public switchTo3DView(duration: number = 0.5): void {
        tween(this.cameraNode)
            .to(duration, { 
                position: new Vec3(this.cameraNode.position.x, this.cameraNode.position.y, 500),
                eulerAngles: new Vec3(-30, 0, 0)
            })
            .start();
    }

    public switchTo2DView(duration: number = 0.5): void {
        tween(this.cameraNode)
            .to(duration, { 
                position: new Vec3(this.cameraNode.position.x, this.cameraNode.position.y, 0),
                eulerAngles: Vec3.ZERO
            })
            .start();
    }

    /**
     * 创建一个场景巡视
     * @returns 
     */
    public createSceneTour(): SceneTour {
        return new SceneTour(this.cameraController);
    }
}



// import { _decorator, Component, Node } from 'cc';
// import { CameraEffectsManager } from './CameraEffectsManager';
// import { CameraController } from '../map/CameraController';

// const { ccclass, property } = _decorator;

// @ccclass('GameManager')
// export class GameManager extends Component {
//     @property(CameraController)
//     cameraController: CameraController = null;

//     private effectsManager: CameraEffectsManager;

//     start() {
//         if (!this.cameraController) {
//             console.error('CameraController not set in the inspector');
//             return;
//         }

//         this.effectsManager = new CameraEffectsManager(this.cameraController);

//         // 初始化迷雾
//         this.effectsManager.initFogOfWar(40000, 40000);
//     }

//     update(deltaTime: number) {
//         // 根据游戏逻辑揭示区域
//         const playerPosition = new Vec3(20000, 20000, 0); // 示例位置
//         this.effectsManager.revealFogArea(playerPosition, 2000); // 较大的揭示半径
//     }

//     // 当需要重置迷雾时调用
//     resetFog() {
//         this.effectsManager.setFogVisible(true);
//     }
// }




// const effectsManager = new CameraEffectsManager(cameraController);

// // 初始化迷雾
// effectsManager.initFogOfWar(mapWidth, mapHeight);

// // 触发地震效果
// effectsManager.earthquake(2, 10);

// // 触发爆炸效果
// effectsManager.explosion(1, 20);

// // 设置多个跟随目标
// cameraController.setTargets([player1Node, player2Node]);

// // 揭示迷雾区域
// effectsManager.revealFogArea(playerPosition, 100);

// // 显示/隐藏迷雾
// effectsManager.setFogVisible(true);
