
import { _decorator, Component, Node, Vec3, director } from 'cc';
const { ccclass, property } = _decorator;

/** 游戏世界管理 */
@ccclass('GameManager')
export class GameManager extends Component {
    // private static instance: GameManager | null = null;
    //  // 获取单例实例
    //  public static getInstance(): GameManager {
    //     if (!GameManager.instance) {
    //         GameManager.instance = new GameManager();
    //     }
    //     return GameManager.instance;
    // }

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
    }

    /** 获取游戏根节点 */
    public getGameRoot(): Node {
        return this.gameRoot;
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

    /** 添加节点到游戏根节点 */
    public addToGameRoot(node: Node): void {
        this.gameRoot.addChild(node);
    }

    /** 从游戏根节点移除节点 */
    public removeFromGameRoot(node: Node): void {
        this.gameRoot.removeChild(node);
    }

    /** 设置游戏根节点位置 */
    public setGameRootPosition(position: Vec3): void {
        this.gameRoot.setPosition(position);
    }

    /** 获取游戏根节点的子节点 */
    public getGameChild(name: string): Node | null {
        return this.gameRoot.getChildByName(name);
    }

    /** 获取游戏根节点的所有子节点 */
    public getAllGameChildren(): Node[] {
        return this.gameRoot.children;
    }

    /** 清空游戏根节点的所有子节点 */
    public clearGameRoot(): void {
        this.gameRoot.removeAllChildren();
    }

    /** 设置游戏根节点的激活状态 */
    public setGameRootActive(active: boolean): void {
        this.gameRoot.active = active;
    }

    /** 获取游戏根节点的激活状态 */
    public isGameRootActive(): boolean {
        return this.gameRoot.active;
    }

    /** 获取相机节点 */
    public getCameraNode(): Node {
        return this.cameraNode;
    }
}
