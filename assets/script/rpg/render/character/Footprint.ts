import { Node, Sprite, SpriteFrame, UITransform, Color } from 'cc';
import { UIElement } from '../UIElement';

export class Footprint extends UIElement {
    private sprite: Sprite;

    private constructor(width: number, height: number) {
        super('Footprint', width, height);
        this.sprite = this.node.addComponent(Sprite);
    }

    public static async create(width: number = 20, height: number = 40): Promise<Footprint> {
        const footprint = new Footprint(width, height);
        await footprint.setup();
        return footprint;
    }

    public async setup(): Promise<void> {
        // 加载足迹的纹理
        const spriteFrame = await this.loadResource<SpriteFrame>('path/to/footprint/texture', SpriteFrame);
        this.sprite.spriteFrame = spriteFrame;
    }

    public setOpacity(opacity: number): void {
        const color = this.sprite.color;
        this.sprite.color = new Color(color.r, color.g, color.b, opacity * 255);
    }

    public reset(): void {
        this.setOpacity(1);
        this.node.removeFromParent();
    }

    public setColor(color: Color): void {
        this.sprite.color = color;
    }
}
