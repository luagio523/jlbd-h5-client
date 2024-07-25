import { Prefab, instantiate, Node, Label, Sprite, resources, tween, sp, dragonBones, Component } from 'cc';
import { ActPlayer, ActPlayerFactory, ActResourceType, ActionOptions } from './ActPlayer';
import { ResPathUtil } from '../util/ResPathUtil';
import { ActType } from '../enum/Act';

export class CharacterRenderer {
    private bodyNode: Node | null = null;
    private nameLabel: Label | null = null;
    private healthBar: Sprite | null = null;
    private manaBar: Sprite | null = null;
    private actPlayer: ActPlayer | null = null;
    private actResurceType: ActResourceType | null = null;

    public initialize(type: ActResourceType) {
        this.actResurceType = type;
        this.setupBody();
    }

    public async setupBody(parent?: Node): Promise<void> {
        const actBodyPath = ResPathUtil.getBodyActPrefabPath(this.actResurceType);
    
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
        this.bodyNode = instantiate(prefab);
        if (parent) {
            parent.addChild(this.bodyNode);
        }
    }

    private setupComponents() {
        if (!this.bodyNode) {
            console.error("Body node is not initialized.");
            return;
        }
        this.nameLabel = this.getComponentFromChild('NameLabel', Label);
        this.healthBar = this.getComponentFromChild('HealthBar', Sprite);
        this.manaBar = this.getComponentFromChild('ManaBar', Sprite);
    }

    private getComponentFromChild<T extends Component>(childName: string, componentType: new () => T): T {
        if (!this.bodyNode) {
            throw new Error("Body node is not initialized.");
        }
        const childNode = this.bodyNode.getChildByName(childName);
        if (!childNode) {
            throw new Error(`Child node ${childName} not found.`);
        }
        const component = childNode.getComponent(componentType);
        if (!component) {
            throw new Error(`Component ${componentType.name} not found on ${childName}.`);
        }
        return component;
    }

    private setupActPlayer() {
        const bodyComponent = this.getBodyComponent();
        this.actPlayer = ActPlayerFactory.createPlayer(this.actResurceType, bodyComponent);
    }

    private getBodyComponent(): Component {
        if (!this.actResurceType) {
            throw new Error("ActResourceType is not initialized.");
        }
        switch (this.actResurceType) {
            case ActResourceType.ACT1:
            case ActResourceType.ACT2:
                return this.getComponentFromChild('Body', Sprite);
            case ActResourceType.ACT3:
                return this.getComponentFromChild('Body', dragonBones.ArmatureDisplay);
            case ActResourceType.ACT4:
                return this.getComponentFromChild('Body', sp.Skeleton);
            default:
                throw new Error(`Unsupported ActResourceType: ${this.actResurceType}`);
        }
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
        if (this.bodyNode) {
            this.bodyNode.setPosition(x, y);
        }
    }

    public async playAction(options:ActionOptions) {
        if (this.actPlayer) {
            await this.actPlayer.changeAct(options);
        }
    }

    public destroy() {
        if (this.bodyNode) {
            this.bodyNode.destroy();
            this.bodyNode = null;
        }
    }
}





// const characterRenderer = new CharacterRenderer();
// characterRenderer.initialize(ActResourceType.ACT1);
// characterRenderer.setupBody(parentNode);
// characterRenderer.updateCharacterStatus('HeroName', 100, 50);
// characterRenderer.playAction('attack', () => {
//     console.log('Action completed');
// });
// characterRenderer.destroy();
