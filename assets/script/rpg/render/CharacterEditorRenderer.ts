import { Node, Label, Sprite, Prefab, resources, instantiate, tween } from 'cc';
import { ResPathUtil } from '../util/ResPathUtil';
import { AnimResourceType } from '../../core/common/animation/Type';
import { ComponentUtil } from '../util/ComponentUil';
import { CharacterAnimator } from '../base/CharacterAnimator';
import { ActAnimationStateFactory, ActionOptions } from '../base/ActAnimationState';

export class CharacterEditorRenderer {
    private characterNode: Node | null = null;
    private nameLabel: Label | null = null;
    private levelLabel: Label | null = null;
    private healthBar: Sprite | null = null;
    private manaBar: Sprite | null = null;
    private characterAnimator: CharacterAnimator | null = null;
    private shadowNode: Node | null = null;

    private animResourceType: AnimResourceType | null = null;

    public initialize(type: AnimResourceType) {
        this.animResourceType = type;
    }

    public async setupCharacter(parent?: Node): Promise<void> {
        await this.setupBody(parent);
        this.setupComponents();
    }

    public async setupBody(parent?: Node): Promise<void> {
        const actBodyPath = ResPathUtil.getBodyActPrefabPath(this.animResourceType!);
    
        try {
            const prefab = await this.loadPrefab(actBodyPath);
            this.createBodyNode(prefab, parent);
        } catch (error) {
            console.error("Failed to setup Character body:", error);
        }
    }
    
    private loadPrefab(path: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            resources.load(path, Prefab, (err, prefab) => {
                if (err) reject(err);
                else resolve(prefab);
            });
        });
    }

    private createBodyNode(prefab: Prefab, parent?: Node) {
        this.characterNode = instantiate(prefab);
        if (parent) parent.addChild(this.characterNode);
    }

    private setupComponents() {
        if (!this.characterNode) {
            console.error("Body node is not initialized.");
            return;
        }
        this.nameLabel = ComponentUtil.getComponentFromChild(this.characterNode, 'nameLabel', Label);
        this.levelLabel = ComponentUtil.getComponentFromChild(this.characterNode, 'levelLabel', Label);
        this.healthBar = ComponentUtil.getComponentFromChild(this.characterNode, 'healthBar', Sprite);
        this.manaBar = ComponentUtil.getComponentFromChild(this.characterNode, 'manaBar', Sprite);
        
        this.shadowNode = this.characterNode.getChildByName('shadow');
        // this.effectsNode = this.characterNode.getChildByName('effects');
        // this.statusEffectsNode = this.characterNode.getChildByName('statusEffects');

        const bodyNode = this.characterNode.getChildByName('Body');
        if (bodyNode) {
            const animationState = ActAnimationStateFactory.createPlayer(bodyNode, this.animResourceType!);
            this.characterAnimator = new CharacterAnimator(animationState);
        }
    }

    public updateCharacterStatus(name: string, level: number, health: number =0, mana: number=0) {
        if (this.nameLabel) this.nameLabel.string = name;
        if (this.levelLabel) this.levelLabel.string = `Lv.${level}`;
        if (this.healthBar) this.updateBarWithTween(this.healthBar, health);
        if (this.manaBar) this.updateBarWithTween(this.manaBar, mana);
    }

    private updateBarWithTween(bar: Sprite, progress: number) {
        tween(bar).to(0.5, { fillRange: progress }, { easing: 'quartOut' }).start();
    }

    public updatePosition(x: number, y: number) {
        if (this.characterNode) this.characterNode.setPosition(x, y);
    }

    public async playAction(options: ActionOptions) {
        if (this.characterAnimator) {
            this.characterAnimator.transitionToState(options);
        }
    }

    

    public update(dt: number) {
        if (this.characterAnimator) this.characterAnimator.update(dt);
    }

    public destroy() {
        if (this.characterNode) {
            this.characterNode.destroy();
            this.characterNode = null;
        }
        this.characterAnimator = null;
    }

    public getNode(): Node | null {
        return this.characterNode;
    }
}
