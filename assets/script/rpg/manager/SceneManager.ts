import { Color, Graphics, Node, Rect, Vec2 } from "cc";


export enum SLayerType {
    Map,
    Drop,
    Entity,
}

export class SceneManager {
    private static instance: SceneManager;
    private rootNode: Node;
    private layers: Map<SLayerType, Node> = new Map();
    private graphics: Graphics;

    private constructor() {}

    public static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }

    public initialize(root: Node): void {
        if (this.rootNode) {
            return;
        }
        this.rootNode = root;
        this.createLayer(SLayerType.Map);
        this.createLayer(SLayerType.Drop);
        this.createLayer(SLayerType.Entity);
    }

    private createLayer(type: SLayerType): void {
        const layer = new Node();
        layer.name = SLayerType[type];
        this.rootNode.addChild(layer);
        this.layers.set(type, layer);
    }
 
    public addToLayer(type: SLayerType, node: Node): void {
        const layer = this.layers.get(type);
        if (layer) {
            layer.addChild(node);
        } else {
            console.warn(`Layer ${SLayerType[type]} not found`);
        }
    }

    private getDrawGraphics(): Graphics {
        if (!this.graphics) {
            const node = new Node();
            this.addToLayer(SLayerType.Drop, node);
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

        graphics.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach(point => graphics.lineTo(point.x, point.y));

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
