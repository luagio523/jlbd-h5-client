import { Color, Graphics, Node, Rect, Sprite, SpriteFrame, UITransform, Vec2, Vec3, warn } from "cc";
import GameObject from "./GameObject";

export default class GameRenderObject extends GameObject {
    protected renderSprite: Sprite; //渲染精灵
    protected renderNode: Node;

    public constructor() {
        super();
        this.renderNode = new Node();
        this.addChild(this.renderNode);
        this.renderSprite = this.renderNode.addComponent(Sprite);
    }

    public getFrame(): SpriteFrame {
        return this.renderSprite.spriteFrame;
    }

    public clearFrame(): void {
        this.renderSprite.spriteFrame = null;
    }

    protected updateFrame(frame: SpriteFrame): void {
        if (frame !== null && frame.texture) {
            this.renderSprite.spriteFrame = frame;
            let offset = frame.offset
            this.renderNode.setPosition(new Vec3(offset.x,offset.y));
        } else {
            warn("update frame texture not exist");
        }
    }

    protected onRemove(): void {
        super.onRemove()
        this.scale2D(1,1)
        this.setAnchor(0.5,0.5)
        this.renderSprite.spriteFrame = null;
    }

    public setAnchor(anchorX?: number, anchorY?: number): void {
        let transform = this.renderNode.getComponent(UITransform)
        if (anchorX !== null) {
            transform.anchorX = anchorX
        }
        if (anchorY !== null) {
            transform.anchorY = anchorY
        }
    }

    public scale2D(x:number,y:number): void {
        this.renderNode.setScale(new Vec3(x,y));
    }

    public drawRenderRect(need: boolean): void {
        let node = this.getChildByName("renderNode");
        if (node) {
            this.removeChild(node);
        }
        if (!need) return;

        const frame = this.renderSprite.spriteFrame;
        if (!frame) return;

        const size = frame.originalSize;
        node = new Node("renderNode");
        const graphics = node.addComponent(Graphics);
        graphics.rect(-size.width / 2, -size.height / 2, size.width, size.height);
        graphics.strokeColor = Color.WHITE;
        graphics.stroke();

        this.addChild(node);
    }

    public get frameRect(): Rect {
        return this.renderSprite.spriteFrame ? this.renderSprite.spriteFrame.rect : new Rect();
    }
}