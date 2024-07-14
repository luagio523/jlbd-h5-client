import display from "../../core/common/utils/display";
import { MapVisualizer } from "./MapVisualizer";
import { Node,  TiledMap, Tween, Vec2, Vec3, _decorator, log, tween } from "cc";
import { GameMap, MapType } from "./GameMap";

const { ccclass, property } = _decorator;
/**
 * 跟踪目标的辅助类
 */
class TrackLookAt {
    private fixedDeltaTime: number; // 固定的时间步长
    private accumulatedTime: number = 0; // 时间累积器

    protected target: Node;
    protected lastPosition: Vec3;
    protected syncViewWithTarget: (callback: Function) => Tween<Node>;
    protected isTweening: boolean;
    protected tween: Tween<Node>;

    public constructor(fixedDeltaTime: number = 0.2) {
        this.fixedDeltaTime = fixedDeltaTime;
    }

    /**
     * 更新跟踪逻辑
     * @param dt 时间增量
     */
    public update(dt: number) {
        if (!this.target) return;
        if (this.isTweening) return;
        this.accumulatedTime += dt;
        if (this.accumulatedTime < this.fixedDeltaTime) {
            return;
        }
        this.accumulatedTime = 0;
        if (!this.lastPosition.equals(this.target.position)) {
            this.syncOnce();
        }
    }

    /**
     * 执行一次同步
     */
    private syncOnce() {
        this.isTweening = true;
        this.tween = this.syncViewWithTarget(() => {
            this.isTweening = false;
        });
    }

    /**
     * 设置跟踪目标
     * @param target 目标节点
     * @param sync 同步函数
     */
    public lookAt(target: Node, sync: (callback: Function) => Tween<Node>) {
        this.target = target;
        this.lastPosition = Vec3.ZERO;
        this.syncViewWithTarget = sync;
        this.syncOnce(); // 直接触发一次
    }
}

/**
 * 地图显示层
 */
export class MapDisplayLayer extends Node {
    protected gameMap: GameMap;

    public constructor(gameMap: GameMap) {
        super();
        this.gameMap = gameMap;
    }

    private mapNode: Node;
    private mapImage: MapVisualizer;

    private offset: Vec2 = new Vec2(0, 0); // 由于图片的切割，可能有不足切割大小的图。

    private lastLookX: number = Number.MAX_VALUE;
    private lastLookY: number = Number.MAX_VALUE;

    protected trackLookAt: TrackLookAt;

    /**
     * 初始化地图层
     */
    public init() {
        this.addChild(this.mapNode = new Node());
        this.mapNode.addComponent(TiledMap);
        this.addChild(this.mapImage = new MapVisualizer());
        this.trackLookAt = new TrackLookAt(0.2); // 每0.2秒检测下跟踪player
    }

    /**
     * 获取瓦片地图组件
     */
    public get tileMap() {
        return this.mapNode.getComponent(TiledMap);
    }

    /**
     * 更新摄像机/视图位置
     * @param dt 时间增量
     */
    public update(dt: number): void {
        // 更新逻辑
    }

    /**
     * 跟踪目标节点
     * @param target 目标节点
     */
    public trackLookAtTarget(target: Node): void {
        this.trackLookAt.lookAt(target, (callback) =>
            this.syncViewWithTarget(target, 0.2, callback)
        );
    }

    /**
     * 使用缓动效果看向目标节点
     * @param target 目标节点
     * @param duration 缓动时间
     */
    public lookAtTargetWithTween(target: Node, duration: number = 0.2): void {
        if (!target || duration <= 0) return;
        if (!target.isValid) return;
        this.syncViewWithTarget(target, duration);
    }

    /**
     * 看向指定坐标点
     * @param tx x坐标
     * @param ty y坐标
     */
    public lookAtPoint(tx: number, ty: number): void {
        if (tx == this.lastLookX && ty == this.lastLookY) {
            return;
        }
        this.lastLookX = tx;
        this.lastLookY = ty;

        let p = new Vec2(tx, ty);
        this.translateToMapCoordinates(p);
        this.setPosition(p.x, p.y);
    }

    /**
     * 同步视图与目标节点
     * @param target 目标节点
     * @param time 缓动时间
     * @param callback 回调函数
     */
    public syncViewWithTarget(target: Node, time: number = 0.1, callback?: Function): Tween<Node> {
        if (!target.isValid) return;

        if (target.position.x == this.lastLookX && target.position.y == this.lastLookY) {
            return;
        }
        this.lastLookX = target.position.x;
        this.lastLookY = target.position.y;

        let p = target.position;
        this.translateToMapCoordinates(new Vec2(target.position.x, target.position.y));

        return tween(<Node>this)
            .to(time, { position: p })
            .call(callback)
            .start();
    }

    /**
     * 将点转换为地图坐标
     * @param point 点
     */
    private translateToMapCoordinates(point: Vec2): void {
        point.x = -Math.min(Math.max(point.x - (display.adaptWidth >> 1), 0), this.gameMap.maxWidth - display.adaptWidth);
        point.y = -Math.min(Math.max(point.y - (display.adaptHeight >> 1), 0), this.gameMap.maxHeight - display.adaptHeight);
    }

    /**
     * 切换地图
     */
    public changeMap() {
        log("Change map for");
        this.off(Node.EventType.TRANSFORM_CHANGED);
        // 提早返回的策略减少条件嵌套
        if (this.gameMap.mapType !== MapType.SLICE) {
            this.updateTileMap();
            this.centerViewOnMap();
            return;
        } else { // 对于地图切块的
            this.calculateOffset(); // 计算偏移的函数
            this.adjustMapView(); // 调整地图视图的函数
            this.updateMapImage(this.gameMap.getFileName());
            this.centerViewOnMap(); // 中心视图到地图的函数
        }
    }

    /**
     * 计算偏移值
     */
    private calculateOffset() {
        const remainderX = this.gameMap.maxWidth % GameMap.IMG_SIZE;
        const remainderY = this.gameMap.maxHeight % GameMap.IMG_SIZE;
        this.offset.x = remainderX > 0 ? GameMap.IMG_SIZE - remainderX : 0;
        this.offset.y = remainderY > 0 ? GameMap.IMG_SIZE - remainderY : 0;
    }

    /**
     * 调整地图视图
     */
    private adjustMapView() {
        this.mapImage.setPosition(this.mapImage.position.x, -this.offset.y); // 切图导致的偏移 不满256的图 视觉上对y轴有影响（多出的黑块区）。不会影响地图本身
    }

    /**
     * 中心视图到地图
     */
    private centerViewOnMap() {
        // 首次加载地图时的视图定位
        this.lookAtPoint(this.gameMap.mapX, this.gameMap.mapY);
    }

    /**
     * 直接更新tileMap地图
     */
    private updateTileMap() {
        this.mapImage.active = false;
        this.mapNode.active = true;
        this.mapNode.setPosition(this.gameMap.maxWidth >> 1, this.gameMap.maxHeight >> 1);
    }

    /**
     * 更新切片地图
     * @param mapName 地图文件名
     */
    private updateMapImage(mapName: string) {
        this.mapNode.active = false;
        this.mapImage.active = true;
        this.on(Node.EventType.TRANSFORM_CHANGED, () => {
            this.updateHDMap();
        });
       
		this.mapImage.setLastUpdate(this.position.x, this.position.y);
        this.mapImage.render(this.gameMap.maxWidth, this.gameMap.maxHeight, GameMap.IMG_SIZE, mapName);
        this.updateHDMap();
    }

    /**
     * 更新高清地图
     * @param force 是否强制更新
     */
    private updateHDMap(force: boolean = false) {
        if (this.mapImage != null) {
            this.mapImage.updateHDMap(this.position, force);
        }
    }
}
