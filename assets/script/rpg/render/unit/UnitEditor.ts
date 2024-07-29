import { Node, Label, Sprite, Prefab, resources, instantiate, tween, UITransform, Color } from 'cc';
import { UnitAnimator } from '../../base/UnitAnimator';
import { AnimResourceType } from '../../../core/animation/Type';
import { ResPathUtil } from '../../util/ResPathUtil';
import { ComponentUtil } from '../../util/ComponentUil';
import { UnitAnimationStateFactory, ActionOptions } from '../../base/UnitAnimationState';
import { UIElement } from '../UIElement';

export class UnitEditor extends UIElement {
    private unitNode: Node | null = null;
    private nameLabel: Label | null = null;
    private levelLabel: Label | null = null;
    private healthBar: Sprite | null = null;
    private manaBar: Sprite | null = null;
    private unitAnimator: UnitAnimator | null = null;
    private shadowNode: Node | null = null;
    private animResourceType: AnimResourceType | null = null;

    constructor(type: AnimResourceType, width: number = 400, height: number=400) {
        super("UnitEditor", width, height);
        this.animResourceType = type;
    }

    public async setup(): Promise<void> {
        const actBodyPath = ResPathUtil.getBodyActPrefabPath(this.animResourceType!);
        const prefab = await this.loadResource<Prefab>(actBodyPath, Prefab)
        if(prefab){
            this.unitNode = instantiate(prefab);
            this.node.addChild(this.unitNode);
        }
        this.nameLabel = ComponentUtil.getComponentFromChild(this.unitNode, 'nameLabel', Label);
        this.levelLabel = ComponentUtil.getComponentFromChild(this.unitNode, 'levelLabel', Label);
        this.healthBar = ComponentUtil.getComponentFromChild(this.unitNode, 'healthBar', Sprite);
        this.manaBar = ComponentUtil.getComponentFromChild(this.unitNode, 'manaBar', Sprite);
        
        this.shadowNode = this.unitNode.getChildByName('shadow');

        const bodyNode = this.unitNode.getChildByName('Body');
        if (bodyNode) {
            const animationState = UnitAnimationStateFactory.createPlayer(bodyNode, this.animResourceType!);
            this.unitAnimator = new UnitAnimator(animationState);
        }
    }


    public updateUnitStatus(name: string, level: number, health: number = 0, mana: number = 0) {
        if (this.nameLabel) this.nameLabel.string = name;
        if (this.levelLabel) this.levelLabel.string = `Lv.${level}`;
        if (this.healthBar) this.updateBarWithTween(this.healthBar, health);
        if (this.manaBar) this.updateBarWithTween(this.manaBar, mana);
    }

    private updateBarWithTween(bar: Sprite, progress: number) {
        tween(bar).to(0.5, { fillRange: progress }, { easing: 'quartOut' }).start();
    }

    public async playAction(options: ActionOptions) {
        if (this.unitAnimator) {
            this.unitAnimator.transitionToState(options);
        }
    }

    public update(dt: number) {
        if (this.unitAnimator) this.unitAnimator.update(dt);
    }

    public reset(): void {
        if (this.unitNode) {
            this.unitNode.removeFromParent();
            this.unitNode.destroy();
            this.unitNode = null;
        }
        this.unitAnimator = null;
        this.nameLabel = null;
        this.levelLabel = null;
        this.healthBar = null;
        this.manaBar = null;
        this.shadowNode = null;
    }

    public setColor(color: Color): void {
        // Implement if needed
    }

    public getUnitNode(): Node | null {
        return this.unitNode;
    }
}
