import { Prefab, instantiate, Node, Label, Sprite, resources, tween, Vec3, sp, dragonBones, Component } from 'cc';
import { ActPlayer, ActPlayerFactory, ActResourceType } from './ActPlayer';
import { ResPathUtil } from '../util/ResPathUtil';

export class BodyRender {
    private bodyNode: Node = null;
    private nameLabel: Label = null;
    private healthBar: Sprite = null;
    private manaBar: Sprite = null;
    private actPlayer:ActPlayer  = null;
    private actResurceType:ActResourceType = null;

    public initialize(type:ActResourceType) {
        this.actResurceType = type;
        this.setupBody();
    }

    public setupBody(parent?: Node) {
        const actBodyPath = ResPathUtil.getBodyActPrefabPath(this.actResurceType);
    
        resources.load(actBodyPath, Prefab, (err, prefab) => {
            if (err) {
                console.error("Failed to load hero prefab:", err);
                return;
            }
    
            this.createBodyNode(prefab, parent);
            this.setupComponents();
            this.setupActPlayer();
        });
    }
    
    private createBodyNode(prefab: Prefab, parent?: Node) {
        this.bodyNode = instantiate(prefab);
        if (parent) {
            parent.addChild(this.bodyNode);
        }
    }
    
    private setupComponents() {
        this.nameLabel = this.getComponentFromChild('NameLabel', Label);
        this.healthBar = this.getComponentFromChild('HealthBar', Sprite);
        this.manaBar = this.getComponentFromChild('ManaBar', Sprite);
    }
    
    private getComponentFromChild<T extends Component>(childName: string, componentType: new () => T): T {
        return this.bodyNode.getChildByName(childName).getComponent(componentType);
    }
    
    private setupActPlayer() {
        const bodyComponent = this.getBodyComponent();
        this.actPlayer = ActPlayerFactory.createPlayer(this.actResurceType, bodyComponent);
    }
    
    private getBodyComponent(): Component {
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
        if (this.bodyNode) {
            this.bodyNode.destroy();
        }
    }
}
