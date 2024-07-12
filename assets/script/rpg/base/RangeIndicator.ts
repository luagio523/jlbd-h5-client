import { Vec2 } from "cc";

export class RangeIndicator {
    private position: Vec2;
    private castRange: number;
    private aoeRadius: number | null;
    private isVisible: boolean;
    private graphics: any;  // 这里应该是您游戏引擎的图形对象

    constructor(position: Vec2, castRange: number, aoeRadius: number | null = null) {
        this.position = position;
        this.castRange = castRange;
        this.aoeRadius = aoeRadius;
        this.isVisible = false;
        this.graphics = this.createGraphics();
    }

    private createGraphics(): any {
        // 这里应该创建并返回一个图形对象
        // 具体实现取决于您使用的游戏引擎或图形库
        // 例如，在 Phaser 中，可能是这样：
        // return this.scene.add.graphics();
        return {};
    }

    public show(): void {
        this.isVisible = true;
        this.draw();
    }

    public hide(): void {
        this.isVisible = false;
        this.clear();
    }

    public updatePosition(newPosition: Vec2): void {
        this.position = newPosition;
        if (this.isVisible) {
            this.draw();
        }
    }

    private draw(): void {
        this.clear();
        
        // 绘制施法范围
        this.drawCircle(this.position, this.castRange, 0x00ff00, 0.2);  // 绿色，半透明

        // 如果有 AOE 范围，也绘制出来
        if (this.aoeRadius !== null) {
            this.drawCircle(this.position, this.aoeRadius, 0xff0000, 0.3);  // 红色，更不透明
        }
    }

    private drawCircle(center: Vec2, radius: number, color: number, alpha: number): void {
        // 这里应该使用您游戏引擎的 API 来绘制圆形
        // 例如，在 Phaser 中，可能是这样：
        // this.graphics.lineStyle(2, color, 1);
        // this.graphics.fillStyle(color, alpha);
        // this.graphics.strokeCircle(center.x, center.y, radius);
        // this.graphics.fillCircle(center.x, center.y, radius);
        console.log(`Drawing circle at (${center.x}, ${center.y}) with radius ${radius}, color ${color}, and alpha ${alpha}`);
    }

    private clear(): void {
        // 清除之前绘制的图形
        // 例如，在 Phaser 中，可能是这样：
        // this.graphics.clear();
        console.log('Clearing graphics');
    }

    public destroy(): void {
        // 清理资源，从场景中移除图形对象等
        this.clear();
        // 例如，在 Phaser 中，可能是这样：
        // this.graphics.destroy();
        console.log('Destroying RangeIndicator');
    }
}