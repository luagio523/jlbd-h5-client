
import { _decorator, Component, Node, Vec3, director } from 'cc';
import { GameWorld } from '../../rpg/GameWorld';
const { ccclass, property } = _decorator;

/** 游戏世界管理 */
@ccclass('GameManager')
export class GameManager extends Component {
    private gameWorld:GameWorld
    /** 游戏根节点 */
    private gameRoot!: Node;
    private cameraNode!: Node;
    private timeScale: number = 1;

    // 私有构造函数，防止直接实例化
    public constructor(gameRoot: Node, cameraNode: Node) {
        super();
        this.initialize(gameRoot, cameraNode);
    }

    public initialize(gameRoot: Node, cameraNode: Node): void {
        this.gameRoot = gameRoot;
        this.cameraNode = cameraNode;
        this.gameWorld = new GameWorld(this.gameRoot, this.cameraNode);
    }

    /** 获取游戏根节点 */
    public getGameWorld(): GameWorld {
        return this.gameWorld;
    }

    /** 设置游戏动画速度 */
    public setTimeScale(scale: number): void {
        if (scale < 0) {
            console.warn('Time scale cannot be negative. Setting to 0.');
            scale = 0;
        }
        this.timeScale = scale;
    }

    /** 获取当前游戏动画速度 */
    public getTimeScale(): number {
        return this.timeScale;
    }

    update(dt: number) {
        // 应用时间缩放
        const scaledDt = dt * this.timeScale;
        this.updateDt(scaledDt);
    }

    private updateDt(dt: number) {
        // 实现更新逻辑
        if(this.gameWorld){
            this.gameWorld.update(dt);
        }
    }

    /** 暂停游戏 */
    public pauseGame(): void {
        director.pause();
    }

    /** 恢复游戏 */
    public resumeGame(): void {
        director.resume();
    }

    /** 重启游戏 */
    public restartGame(): void {
        // 实现重启逻辑
    }

    
}
