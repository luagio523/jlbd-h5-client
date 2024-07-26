
import { Node, Sprite, SpriteFrame, UITransform, Color, Vec3, resources } from 'cc';

export class StatusBar {
    private node: Node;
    private backgroundSprite: Sprite;
    private foregroundSprite: Sprite;
    private stageSpriteFrames: SpriteFrame[] = [];
    private currentStage: number = 0;

    public static async create(width: number = 100, height: number = 10): Promise<StatusBar> {
        const statusBar = new StatusBar(width, height);
        await statusBar.preloadTextures();
        return statusBar;
    }

    private constructor(width: number, height: number) {
        // 创建主节点
        this.node = new Node('StatusBar');
        const transform = this.node.addComponent(UITransform);
        transform.setContentSize(width, height);

        // 创建背景
        const bgNode = new Node('Background');
        bgNode.setParent(this.node);
        const bgTransform = bgNode.addComponent(UITransform);
        bgTransform.setContentSize(width, height);
        this.backgroundSprite = bgNode.addComponent(Sprite);

        // 创建前景
        const fgNode = new Node('Foreground');
        fgNode.setParent(this.node);
        const fgTransform = fgNode.addComponent(UITransform);
        fgTransform.setContentSize(width, height);
        this.foregroundSprite = fgNode.addComponent(Sprite);
        this.foregroundSprite.type = Sprite.Type.FILLED;
        this.foregroundSprite.fillType = Sprite.FillType.HORIZONTAL;
        this.foregroundSprite.fillStart = 0;
        this.foregroundSprite.fillRange = 1;
    }

    private async preloadTextures(): Promise<void> {
        const texturePaths = [
            'anim/eff/bloodBg',
            'anim/eff/bloodGeen',
            'anim/eff/bloodRed'
        ];

        const loadPromises = texturePaths.map(path => this.loadSpriteFrame(path));
        this.stageSpriteFrames = await Promise.all(loadPromises);

        // 设置背景和初始前景
        this.backgroundSprite.spriteFrame = this.stageSpriteFrames[0];
        this.foregroundSprite.spriteFrame = this.stageSpriteFrames[1];
    }

    private loadSpriteFrame(path: string): Promise<SpriteFrame> {
        return new Promise((resolve, reject) => {
            resources.load(path, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error(`Failed to load sprite frame: ${path}`, err);
                    reject(err);
                } else {
                    resolve(spriteFrame);
                }
            });
        });
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
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(width, height);
        }
        
        const bgTransform = this.backgroundSprite.node.getComponent(UITransform);
        if (bgTransform) {
            bgTransform.setContentSize(width, height);
        }
        
        const fgTransform = this.foregroundSprite.node.getComponent(UITransform);
        if (fgTransform) {
            fgTransform.setContentSize(width, height);
        }
    }

    public setPosition(x: number, y: number, z: number = 0): void {
        this.node.setPosition(new Vec3(x, y, z));
    }

    public getNode(): Node {
        return this.node;
    }
}
