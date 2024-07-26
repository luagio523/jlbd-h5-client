import { _decorator, Component, Texture2D, UIOpacity, resources, tween, warn, Node, Vec3, Sprite, SpriteFrame, NodePool } from "cc";
import app from "../../App";

const { ccclass, property } = _decorator;

@ccclass('Footprint')
export class Footprint extends Component {
    private static readonly DEFAULT_TEXTURE = "images/foot/1";
    private static readonly POOL_SIZE = 20;

    @property(SpriteFrame)
    private footprintSpriteFrame: SpriteFrame | null = null;

    private nodePool: NodePool = new NodePool();
    private footLayer: Node | null = null;

    onLoad() {
        this.loadDefaultTexture();
        this.initializePool();
    }

    private loadDefaultTexture() {
        if (!this.footprintSpriteFrame) {
            resources.load(Footprint.DEFAULT_TEXTURE, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    warn("Failed to load default footprint texture:", err);
                    return;
                }
                this.footprintSpriteFrame = spriteFrame;
            });
        }
    }

    private initializePool() {
        for (let i = 0; i < Footprint.POOL_SIZE; i++) {
            const node = this.createFootprintNode();
            this.nodePool.put(node);
        }
    }

    public setFootLayer(layer: Node) {
        this.footLayer = layer;
    }

    public changeTexture(path: string) {
        resources.load(path, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                warn("Failed to load footprint texture:", path, err);
                return;
            }
            this.footprintSpriteFrame = spriteFrame;
        });
    }

    public createFootprint(position: Vec3) {
        if (!this.footprintSpriteFrame || !this.footLayer) return;

        let footprintNode = this.nodePool.get();
        if (!footprintNode) {
            footprintNode = this.createFootprintNode();
        }

        const sprite = footprintNode.getComponent(Sprite);
        if (sprite) {
            sprite.spriteFrame = this.footprintSpriteFrame;
        }

        footprintNode.setPosition(position);

        const opacity = footprintNode.getComponent(UIOpacity) || footprintNode.addComponent(UIOpacity);
        opacity.opacity = 140;

        this.footLayer.addChild(footprintNode);

        this.animateFootprint(footprintNode, opacity);
        this.playFootstepSound();
    }

    private animateFootprint(node: Node, opacity: UIOpacity) {
        tween(opacity)
            .delay(0.5)
            .to(1, { opacity: 0 })
            .call(() => {
                node.removeFromParent();
                this.nodePool.put(node);
            })
            .start();
    }

    private playFootstepSound() {
        app.audio.playSFX("walk");
    }

    private createFootprintNode(): Node {
        const node = new Node("Footprint");
        const sprite = node.addComponent(Sprite);
        if (this.footprintSpriteFrame) {
            sprite.spriteFrame = this.footprintSpriteFrame;
        }
        node.addComponent(UIOpacity);
        return node;
    }

    public clear() {
        this.nodePool.clear();
    }
}


// @ccclass('GameController')
// export class GameController extends Component {
//     @property(FootprintManager)
//     private footprintManager: FootprintManager | null = null;

//     @property(Node)
//     private dropLayer: Node | null = null;

//     start() {
//         if (this.footprintManager && this.dropLayer) {
//             this.footprintManager.setFootLayer(this.dropLayer);
//         }
        
//         // 如果需要更改纹理
//         this.footprintManager?.changeTexture("path/to/new/texture");
//     }

//     update(dt: number) {
//         // 在适当的时候创建足迹
//         if (/* 某些条件 */) {
//             const position = new Vec3(/* x */, /* y */, 0);
//             this.footprintManager?.createFootprint(position);
//         }
//     }
// }