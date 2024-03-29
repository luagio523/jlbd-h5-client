import { Color, Graphics, Node, Rect, Vec2 } from "cc";
import { MapLayer } from "../map/MapLayer";
import { GameMap } from "../map/GameMap";
import EntityLayer from "../map/EntityLayer";

export enum LayerType {
    MapLayer,
    DropLayer,
    EntityLayer,
    EffectLayer
}

export class SceneManager {

    public static readonly Inst = new SceneManager
    protected rootNode: Node
    protected mapLayer: Node;
    protected dropLayer: Node;
    protected entityLayer: Node;
    protected effectLayer: Node;

    public initLayers(root: Node): void {
        this.rootNode = root;

        // 创建并添加地图层
        this.mapLayer = new MapLayer(GameMap.ins());
        this.addNewLayer(this.mapLayer, LayerType.MapLayer);

        // 创建并添加掉落物层
        this.dropLayer = new Node();
        this.addNewLayer(this.dropLayer, LayerType.DropLayer);

        // 创建并添加实体层
        this.entityLayer = new EntityLayer();
        this.addNewLayer(this.entityLayer, LayerType.EntityLayer);

        // 创建并添加效果层
        this.effectLayer = new Node();
        this.addNewLayer(this.effectLayer, LayerType.EffectLayer);
    }

    protected addNewLayer(layer: Node, layerType: LayerType): void {
        layer.name = LayerType[layerType];
        this.rootNode.addChild(layer);
    }

    public addToEntityLayer(entity: Node): void {
        this.entityLayer.addChild(entity);
    }

    public addToEffectLayer(effect: Node): void {
        this.effectLayer.addChild(effect);
    }

    public addToDropLayer(item: Node): void {
        this.dropLayer.addChild(item);
    }






















    /***********************************************************用于测试********************************************************************* */

    protected getDrawGraphics() {
        if (this.graphics) {
            return this.graphics
        }
        let node = new Node()
        this.addToDropLayer(node)
        node.setSiblingIndex(1)
        this.graphics = node.addComponent(Graphics)
        return this.graphics
    }

    protected graphics: Graphics

    public draw(points: Array<Vec2>, color: Color = Color.GREEN) {

        let graphics = this.getDrawGraphics()
        graphics.clear()

        graphics.strokeColor = color
        graphics.lineWidth = 6

        for (let index = 0; index < points.length; index++) {
            const element = points[index];
            if (index == 0) {
                graphics.moveTo(element.x, element.y)
            } else {
                graphics.lineTo(element.x, element.y)

            }
        }
        graphics.stroke()
    }

    public draw3(rect: Rect, color: Color = Color.GREEN) {
        let graphics = this.getDrawGraphics()
        graphics.clear()

        graphics.strokeColor = color
        graphics.lineWidth = 4

        graphics.rect(rect.x, rect.y, rect.width, rect.height)


        graphics.stroke()
    }
}