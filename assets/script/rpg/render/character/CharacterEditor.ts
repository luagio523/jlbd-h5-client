import { Node, Label, Sprite, Prefab, resources, instantiate, tween, UITransform, Color } from 'cc';
import { CharacterAnimator } from '../../base/CharacterAnimator';
import { AnimResourceType } from '../../../core/animation/Type';
import { ResPathUtil } from '../../util/ResPathUtil';
import { ComponentUtil } from '../../util/ComponentUil';
import { ActAnimationStateFactory, ActionOptions } from '../../base/ActAnimationState';
import { UIElement } from '../UIElement';

export class CharacterEditor extends UIElement {
    private characterNode: Node | null = null;
    private nameLabel: Label | null = null;
    private levelLabel: Label | null = null;
    private healthBar: Sprite | null = null;
    private manaBar: Sprite | null = null;
    private characterAnimator: CharacterAnimator | null = null;
    private shadowNode: Node | null = null;
    private animResourceType: AnimResourceType | null = null;

    constructor(type: AnimResourceType, width: number = 400, height: number=400) {
        super("CharacterEditor", width, height);
        this.animResourceType = type;
    }

    public async setup(): Promise<void> {
        const actBodyPath = ResPathUtil.getBodyActPrefabPath(this.animResourceType!);
        const prefab = await this.loadResource<Prefab>(actBodyPath, Prefab)
        if(prefab){
            this.characterNode = instantiate(prefab);
            this.node.addChild(this.characterNode);
        }
        this.nameLabel = ComponentUtil.getComponentFromChild(this.characterNode, 'nameLabel', Label);
        this.levelLabel = ComponentUtil.getComponentFromChild(this.characterNode, 'levelLabel', Label);
        this.healthBar = ComponentUtil.getComponentFromChild(this.characterNode, 'healthBar', Sprite);
        this.manaBar = ComponentUtil.getComponentFromChild(this.characterNode, 'manaBar', Sprite);
        
        this.shadowNode = this.characterNode.getChildByName('shadow');

        const bodyNode = this.characterNode.getChildByName('Body');
        if (bodyNode) {
            const animationState = ActAnimationStateFactory.createPlayer(bodyNode, this.animResourceType!);
            this.characterAnimator = new CharacterAnimator(animationState);
        }
    }


    public updateCharacterStatus(name: string, level: number, health: number = 0, mana: number = 0) {
        if (this.nameLabel) this.nameLabel.string = name;
        if (this.levelLabel) this.levelLabel.string = `Lv.${level}`;
        if (this.healthBar) this.updateBarWithTween(this.healthBar, health);
        if (this.manaBar) this.updateBarWithTween(this.manaBar, mana);
    }

    private updateBarWithTween(bar: Sprite, progress: number) {
        tween(bar).to(0.5, { fillRange: progress }, { easing: 'quartOut' }).start();
    }

    public async playAction(options: ActionOptions) {
        if (this.characterAnimator) {
            this.characterAnimator.transitionToState(options);
        }
    }

    public update(dt: number) {
        if (this.characterAnimator) this.characterAnimator.update(dt);
    }

    public reset(): void {
        if (this.characterNode) {
            this.characterNode.removeFromParent();
            this.characterNode.destroy();
            this.characterNode = null;
        }
        this.characterAnimator = null;
        this.nameLabel = null;
        this.levelLabel = null;
        this.healthBar = null;
        this.manaBar = null;
        this.shadowNode = null;
    }

    public setColor(color: Color): void {
        // Implement if needed
    }

    public getCharacterNode(): Node | null {
        return this.characterNode;
    }
}
