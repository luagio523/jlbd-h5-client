import { _decorator, Component, Node, Vec3, Graphics, Color, Rect } from 'cc';
import { EntityLayer } from '../layer/EntityLayer';
import { ECSEntity } from '../ecs/ECSEntity';
import { DropLayer } from '../layer/DropLayer';
const { ccclass, property } = _decorator;

export enum SLayerType {
    Map,
    GroundEffect,  // 更改名称
    Drop,
    Entity,
    OverlayEffect
}

export class SceneManager {
    private static instance: SceneManager;
    private layers: Map<SLayerType, Node> = new Map();
    private graphics: Graphics;
    private rootNode: Node;

    private constructor() {}

    public static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }

    public initialize(root: Node): void {
        if (this.rootNode) return;
        this.rootNode = root;
        Object.values(SLayerType).forEach(type => {
            if (typeof type === 'number') this.createLayer(type);
        });
    }

    private createLayer(type: SLayerType): void {
        let layer: Node;
        switch (type) {
            case SLayerType.Entity:
                layer = new EntityLayer();
                break;
            case SLayerType.Drop:
                layer = new DropLayer();
                break;
            default:
                layer = new Node(SLayerType[type]);
        }
        this.rootNode.addChild(layer);
        this.layers.set(type, layer);
    }

    public addEntity(entity: ECSEntity): void {
        (this.layers.get(SLayerType.Entity) as EntityLayer).addEntity(entity);
    }

    public removeEntity(entity: ECSEntity): void {
        (this.layers.get(SLayerType.Entity) as EntityLayer).removeEntity(entity);
    }

    // public addDrop(drop: DropItem): void {
    //     (this.layers.get(SLayerType.Drop) as DropLayer).addDrop(drop);
    // }

    // public removeDrop(drop: DropItem): void {
    //     (this.layers.get(SLayerType.Drop) as DropLayer).removeDrop(drop);
    // }

    public addToLayer(type: SLayerType, node: Node): void {
        const layer = this.layers.get(type);
        if (layer) {
            layer.addChild(node);
        } else {
            console.warn(`Layer ${SLayerType[type]} not found`);
        }
    }

    public getLayer(type: SLayerType): Node | undefined {
        return this.layers.get(type);
    }

    public addGroundEffect(effect: Node, position: Vec3): void {
        effect.position = position;
        this.addToLayer(SLayerType.GroundEffect, effect);
    }

    public addOverlayEffect(effect: Node): void {
        this.addToLayer(SLayerType.OverlayEffect, effect);
    }

    private getDrawGraphics(): Graphics {
        if (!this.graphics) {
            const node = new Node('DebugGraphics');
            this.addToLayer(SLayerType.OverlayEffect, node);
            this.graphics = node.addComponent(Graphics);
        }
        return this.graphics;
    }

    public draw(points: Vec3[], color: Color = Color.GREEN): void {
        const g = this.getDrawGraphics();
        g.clear();
        g.strokeColor = color;
        g.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach(p => g.lineTo(p.x, p.y));
        g.stroke();
    }

    public drawRect(rect: Rect, color: Color = Color.GREEN): void {
        const g = this.getDrawGraphics();
        g.clear();
        g.strokeColor = color;
        g.rect(rect.x, rect.y, rect.width, rect.height);
        g.stroke();
    }
}