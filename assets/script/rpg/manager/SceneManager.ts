
import { Color, Graphics, Node, Rect, Vec2 } from "cc";
import { MapDisplayLayer } from "../map/MapDisplayLayer";
import { GameMap } from "../map/GameMap";
import EntityLayer from "../map/EntityLayer";

export enum LayerType {
    MapLayer,
    DropLayer,
    EntityLayer,
    EffectLayer
}

export class SceneManager {
    private static instance: SceneManager;
    private rootNode: Node;
    private layers: Map<LayerType, Node> = new Map();
    private graphics: Graphics;

    private constructor() {}

    public static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }

    public initLayers(root: Node): void {
        this.rootNode = root;

        this.addLayer(LayerType.MapLayer, new MapDisplayLayer(GameMap.ins()));
        this.addLayer(LayerType.DropLayer, new Node());
        this.addLayer(LayerType.EntityLayer, new EntityLayer());
        this.addLayer(LayerType.EffectLayer, new Node());
    }

    private addLayer(type: LayerType, layer: Node): void {
        layer.name = LayerType[type];
        this.rootNode.addChild(layer);
        this.layers.set(type, layer);
    }

    public addToLayer(type: LayerType, node: Node): void {
        const layer = this.layers.get(type);
        if (layer) {
            layer.addChild(node);
        } else {
            console.warn(`Layer ${LayerType[type]} not found`);
        }
    }

    private getDrawGraphics(): Graphics {
        if (!this.graphics) {
            const node = new Node();
            this.addToLayer(LayerType.DropLayer, node);
            node.setSiblingIndex(1);
            this.graphics = node.addComponent(Graphics);
        }
        return this.graphics;
    }

    public draw(points: Vec2[], color: Color = Color.GREEN): void {
        const graphics = this.getDrawGraphics();
        graphics.clear();
        graphics.strokeColor = color;
        graphics.lineWidth = 6;

        points.forEach((point, index) => {
            if (index === 0) {
                graphics.moveTo(point.x, point.y);
            } else {
                graphics.lineTo(point.x, point.y);
            }
        });

        graphics.stroke();
    }

    public drawRect(rect: Rect, color: Color = Color.GREEN): void {
        const graphics = this.getDrawGraphics();
        graphics.clear();
        graphics.strokeColor = color;
        graphics.lineWidth = 4;
        graphics.rect(rect.x, rect.y, rect.width, rect.height);
        graphics.stroke();
    }
}