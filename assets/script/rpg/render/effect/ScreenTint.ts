import { Color, UIOpacity, Sprite, UITransform } from 'cc';
import { UIElement } from '../UIElement';

export class ScreenTint extends UIElement {
    private uiOpacity: UIOpacity;
    private sprite: Sprite;

    constructor(width: number, height: number) {
        super('ScreenTint', width, height);
        
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0.5, 0.5);

        this.uiOpacity = this.node.addComponent(UIOpacity);
        this.sprite = this.node.addComponent(Sprite);
        this.sprite.color = new Color(255, 0, 0, 255); // 默认为红色
        this.uiOpacity.opacity = 0; // 初始时完全透明
    }

    public static async create(width: number, height: number): Promise<ScreenTint> {
        const screenTint = new ScreenTint(width, height);
        await screenTint.setup();
        return screenTint;
    }

    public async setup(): Promise<void> {
        // 如果需要加载任何资源，可以在这里进行
    }

    public setColor(color: Color): void {
        this.sprite.color = color;
    }

    public setOpacity(opacity: number): void {
        this.uiOpacity.opacity = opacity;
    }

    public getUIOpacity(): UIOpacity {
        return  this.uiOpacity;
    }

    public reset(): void {
        this.setOpacity(0);
        this.node.removeFromParent();
    }
}
