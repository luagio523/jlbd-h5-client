import { Graphics, Node, log } from "cc"
import GameImage from "./TileImage"
import { ResPathUtil } from "./ResPathUtil"


export default class MiniMap extends Node {
    private mapImage: GameImage;
    private roadNode: Node;
    public showPath: boolean = true;

    public static MINI_WIDTH = 445;
    public static MINI_HEIGHT = 445;

    public constructor() {
        super();
        this.mapImage = new GameImage();
        this.addChild(this.mapImage);

        this.roadNode = new Node();
        this.addChild(this.roadNode);
    }

    public updateMap(name: string) {
        this.mapImage.source = ResPathUtil.GetMapMiniPath(name);
    }

    public updateRoadPath(paths: Array<any>) {
        // 清除旧的路径
        this.roadNode.removeAllChildren();

        // 添加新的路径
        paths.forEach(path => {
            const pathNode = new Node();
            // 假设路径节点有一些特定的设置，例如颜色、宽度等
            // pathNode.setColor(path.color);
            // pathNode.setWidth(path.width);
            this.roadNode.addChild(pathNode);
        });
    }

    public setSize(width: number, height: number) {
        const scaleX = width / MiniMap.MINI_WIDTH;
        const scaleY = height / MiniMap.MINI_HEIGHT;
        this.mapImage.setScale(scaleX, scaleY);
        this.roadNode.setScale(scaleX, scaleY);
    }

    /**
     * 点击小地图
     * @param x 
     * @param y 
     */
    public checkTouch(event: Touch): boolean {
        return false;
        // const touchPos = event.getLocation();
        // const localPos = this.convertToNodeSpace(touchPos);

        // // 检查点击是否在地图范围内
        // if (localPos.x >= 0 && localPos.x <= MiniMap.MINI_WIDTH && localPos.y >= 0 && localPos.y <= MiniMap.MINI_HEIGHT) {
        //     // 处理点击事件
        //     console.log(`Clicked at: ${localPos.x}, ${localPos.y}`);
        //     return true;
        // }

        // return false;
    }
}
