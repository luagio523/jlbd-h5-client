import { Node, Label, UITransform, Color, Vec3, resources, Font } from 'cc';
import { UIElement } from '../UIElement';

export class DamageNumber extends UIElement {
    private label: Label;
    private font: Font | null = null;

    private constructor(fontSize: number) {
        super('DamageNumber', 100, fontSize);
        this.label = this.node.addComponent(Label);
        this.label.fontSize = fontSize;
        this.label.horizontalAlign = Label.HorizontalAlign.CENTER;
        this.label.verticalAlign = Label.VerticalAlign.CENTER;
    }

    public static create(fontSize: number = 40): DamageNumber {
        const damageNumber = new DamageNumber(fontSize);
        return damageNumber;
    }

    public async setup(): Promise<void> {
        // this.font = await this.loadResource<Font>('path/to/your/font', Font);
        // if (this.font) {
        //     this.label.font = this.font;
        // }
    }

    public setText(damage: number): void {
        this.label.string = damage.toString();
    }

    public setColor(color: Color): void {
        this.label.color = color;
    }

    public setFontSize(fontSize: number): void {
        this.label.fontSize = fontSize;
        this.setSize(100, fontSize);
    }

    public reset(): void {
        this.label.string = '';
        this.label.color = Color.WHITE;
        this.node.removeFromParent();
    }
}
