import { Prefab, instantiate, Node, Label, Sprite, resources, tween, Vec3 } from 'cc';
import { MoviePlayer } from './MoviePlayer';

export class HeroRender {
    private node: Node = null;
    private nameLabel: Label = null;
    private healthBar: Sprite = null;
    private manaBar: Sprite = null;
    private bodyPlayer:MoviePlayer = null;

    constructor(parent: Node) {
        this.loadHeroPrefab(parent);
    }

    private loadHeroPrefab(parent: Node) {
        resources.load("prefabs/HeroPrefab", Prefab, (err, prefab) => {
            if (err) {
                console.error("Failed to load hero prefab:", err);
                return;
            }

            const heroNode = instantiate(prefab);
            parent.addChild(heroNode);

            this.node = heroNode;
            this.nameLabel = heroNode.getChildByName('NameLabel').getComponent(Label);
            this.healthBar = heroNode.getChildByName('HealthBar').getComponent(Sprite);
            this.manaBar = heroNode.getChildByName('ManaBar').getComponent(Sprite);
            this.bodyPlayer = heroNode.getChildByName('BodyPlayer').getComponent(MoviePlayer);

            this.updateHero('HeroName', 1.0, 1.0);
        });
    }

    updateHero(name: string, health: number, mana: number) {
        if (this.nameLabel) {
            this.nameLabel.string = name;
        }
        if (this.healthBar) {
            this.updateBarWithTween(this.healthBar, health);
        }
        if (this.manaBar) {
            this.updateBarWithTween(this.manaBar, mana);
        }
    }

    private updateBarWithTween(bar: Sprite, progress: number) {
        if (bar) {
            // 使用 tween 来缓动更新进度条
            tween(bar)
                .to(0.5, { fillRange: progress }, {
                    easing: 'quartOut' // 使用四次方缓出效果，你可以根据需要调整
                })
                .start();
        }
    }

    destroy() {
        if (this.node) {
            this.node.destroy();
        }
    }
}
