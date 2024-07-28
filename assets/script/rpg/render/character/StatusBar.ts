
import { Node, Sprite, SpriteFrame, UITransform, Color, Vec3, resources } from 'cc';
import { UIElement } from '../UIElement';

export class StatusBar extends UIElement {
    private backgroundSprite: Sprite;
    private foregroundSprite: Sprite;
    private stageSpriteFrames: SpriteFrame[] = [];
    private currentStage: number = 0;

    private constructor(width: number, height: number) {
        super('StatusBar', width, height);

        const bgNode = new Node('Background');
        bgNode.setParent(this.node);
        const bgTransform = bgNode.addComponent(UITransform);
        bgTransform.setContentSize(width, height);
        this.backgroundSprite = bgNode.addComponent(Sprite);

        const fgNode = new Node('Foreground');
        fgNode.setParent(this.node);
        const fgTransform = fgNode.addComponent(UITransform);
        fgTransform.setContentSize(width, height);
        this.foregroundSprite = fgNode.addComponent(Sprite);
        this.foregroundSprite.type = Sprite.Type.FILLED;
        this.foregroundSprite.fillType = Sprite.FillType.HORIZONTAL;
    }

    public static async create(width: number = 100, height: number = 10): Promise<StatusBar> {
        const statusBar = new StatusBar(width, height);
        await statusBar.setup();
        return statusBar;
    }

    public async setup(): Promise<void> {
        const texturePaths = [
            'anim/eff/bloodBg',
            'anim/eff/bloodGeen',
            'anim/eff/bloodRed'
        ];

        const loadPromises = texturePaths.map(path => this.loadResource<SpriteFrame>(path + "/spriteFrame", SpriteFrame));
        this.stageSpriteFrames = await Promise.all(loadPromises);

        this.backgroundSprite.spriteFrame = this.stageSpriteFrames[0];
        this.foregroundSprite.spriteFrame = this.stageSpriteFrames[1];

        this.foregroundSprite.fillStart = 0;
        this.foregroundSprite.fillRange = 1;
    }

    public setProgress(progress: number): void {
        this.foregroundSprite.fillRange = Math.max(0, Math.min(1, progress));
    }

    public setStage(stage: number): void {
        if (stage >= 1 && stage < this.stageSpriteFrames.length && stage !== this.currentStage) {
            this.foregroundSprite.spriteFrame = this.stageSpriteFrames[stage];
            this.currentStage = stage;
        }
    }

    public setColor(color: Color): void {
        this.foregroundSprite.color = color;
    }

    public setSize(width: number, height: number): void {
        super.setSize(width, height);
        this.backgroundSprite.node.getComponent(UITransform).setContentSize(width, height);
        this.foregroundSprite.node.getComponent(UITransform).setContentSize(width, height);
    }

    public reset(): void {
        this.setProgress(1);
        this.setStage(1);
        this.foregroundSprite.color = Color.WHITE;
        this.node.removeFromParent();
    }
}
