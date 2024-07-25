import { Prefab, instantiate, Node, Label, Sprite, resources, tween, sp, dragonBones, Component } from 'cc';
import { ActPlayer, ActPlayerFactory,  ActionOptions } from './ActPlayer';
import { ResPathUtil } from '../util/ResPathUtil';
import { AnimResourceType } from '../../core/common/animation/Type';
import { ComponentUtil } from '../util/ComponentUil';

export class CharacterRenderer {
    private characterNode: Node | null = null;
    private nameLabel: Label | null = null;
    private healthBar: Sprite | null = null;
    private manaBar: Sprite | null = null;
    private actPlayer: ActPlayer | null = null;
    private animResourceType: AnimResourceType | null = null;

    public  initialize(type: AnimResourceType)  {
        this.animResourceType = type;
    }

    public async setupBody(parent?: Node): Promise<void> {
        const actBodyPath = ResPathUtil.getBodyActPrefabPath(this.animResourceType);
    
        try {
            const prefab = await this.loadPrefab(actBodyPath);
            this.createBodyNode(prefab, parent);
            this.setupComponents();
            this.setupActPlayer();
        } catch (error) {
            console.error("Failed to setup Character body:", error);
        }
    }
    
    private loadPrefab(path: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            resources.load(path, Prefab, (err, prefab) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(prefab);
                }
            });
        });
    }

    private createBodyNode(prefab: Prefab, parent?: Node) {
        this.characterNode = instantiate(prefab);
        if (parent) {
            parent.addChild(this.characterNode);
        }
    }

    private setupComponents() {
        if (!this.characterNode) {
            console.error("Body node is not initialized.");
            return;
        }
        this.nameLabel = ComponentUtil.getComponentFromChild(this.characterNode, 'NameLabel', Label);
        this.healthBar =ComponentUtil.getComponentFromChild(this.characterNode,'HealthBar', Sprite);
        this.manaBar = ComponentUtil.getComponentFromChild(this.characterNode,'ManaBar', Sprite);
    }


    private setupActPlayer() {
        let bodyNode = this.characterNode.getChildByName('Body');
        this.actPlayer = ActPlayerFactory.createPlayer(bodyNode,this.animResourceType );
    }


    public updateCharacterStatus(name: string, health: number, mana: number) {
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

    public updatePosition(x: number, y: number) {
        if (this.characterNode) {
            this.characterNode.setPosition(x, y);
        }
    }

    public async playAction(options:ActionOptions) {
        if (this.actPlayer) {
            await this.actPlayer.changeAct(options);
        }
    }

    public update(dt: number) {
        if (this.actPlayer) {
            this.actPlayer.update(dt);
        }
    }

    public destroy() {
        if (this.characterNode) {
            this.characterNode.destroy();
            this.characterNode = null;
        }
    }
}





// const characterRenderer = new CharacterRenderer();
// characterRenderer.initialize(AnimResourceType.ACT1);
// characterRenderer.setupBody(parentNode);
// characterRenderer.updateCharacterStatus('HeroName', 100, 50);
// characterRenderer.playAction('attack', () => {
//     console.log('Action completed');
// });
// characterRenderer.destroy();
