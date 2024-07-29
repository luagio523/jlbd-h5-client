import { Node, Label, Sprite, UITransform, Vec3, Color } from 'cc';
import { createUnitBody } from './UnitBody';
import { StatusBar } from './StatusBar';
import { AnimResourceType } from '../../../core/animation/Type';
import { UIElement } from '../UIElement';
import { UnitAnimationStateFactory, ActionOptions } from '../../base/UnitAnimationState';
import { UnitAnimator } from '../../base/UnitAnimator';

export class Unit extends UIElement {
    private static HEALTH_BAR_OFFSET = 20;
    private static MANA_BAR_OFFSET = 10;
    private static NAME_LABEL_OFFSET = 32;
    private static LEVEL_LABEL_HORIZONTAL_OFFSET = 10;

    private bodyNode: UIElement;
    private shadowNode: Node;
    private healthBar: StatusBar;
    private manaBar: StatusBar;
    private levelLabel: Label;
    private nameLabel: Label;

    private unitAnimator: UnitAnimator | null = null;
    private animResourceType: AnimResourceType | null = null;


    private constructor(bodyType: AnimResourceType, width: number = 400, height: number = 400) {
        super('Unit', width, height);
        this.animResourceType = bodyType;
        this.transform.setAnchorPoint(0.5, 0);


        this.bodyNode = createUnitBody(bodyType, width, height);
        const bodyTransform = this.bodyNode.getNode().getComponent(UITransform);
        if (bodyTransform) {
            bodyTransform.setAnchorPoint(0.5, 0);
        }
        this.node.addChild(this.bodyNode.getNode());

        const animationState = UnitAnimationStateFactory.createPlayer(this.bodyNode.getNode(), this.animResourceType!);
        this.unitAnimator = new UnitAnimator(animationState);

        this.shadowNode = new Node('Shadow');
        const shadowTransform = this.shadowNode.addComponent(UITransform);
        shadowTransform.setAnchorPoint(0.5, 0);
        const shadowSprite = this.shadowNode.addComponent(Sprite);
        this.node.addChild(this.shadowNode);

        this.nameLabel = new Node('NameLabel').addComponent(Label);
        this.nameLabel.fontSize = 14;
        this.node.addChild(this.nameLabel.node);

        this.levelLabel = new Node('LevelLabel').addComponent(Label);
        this.levelLabel.fontSize = 10;
        this.node.addChild(this.levelLabel.node);

        this.healthBar = StatusBar.create(100, 10);
        this.node.addChild(this.healthBar.getNode());

        this.manaBar = StatusBar.create(100, 10);
        this.node.addChild(this.manaBar.getNode());

        this.adjustComponents();
    }

    public static create(bodyType: AnimResourceType, width: number = 100, height: number = 100): Unit {
        const unitNode = new Unit(bodyType, width, height);
        return unitNode;
    }

    public async setup(): Promise<void> {
        await this.healthBar.setup();
        await this.manaBar.setup();
    }

    private adjustComponents() {
        const bodyHeight = this.bodyNode.getNode().getComponent(UITransform)?.height || 0;

        if (this.healthBar) {
            this.healthBar.setPosition(0, bodyHeight + Unit.HEALTH_BAR_OFFSET);
        }

        if (this.manaBar) {
            this.manaBar.setPosition(0, bodyHeight + Unit.MANA_BAR_OFFSET);
        }

        this.nameLabel.node.setPosition(0, bodyHeight + Unit.NAME_LABEL_OFFSET);

        const healthBarWidth = this.healthBar?.getNode().getComponent(UITransform)?.width || 0;
        this.levelLabel.node.setPosition(healthBarWidth / 2 + Unit.LEVEL_LABEL_HORIZONTAL_OFFSET, bodyHeight + Unit.HEALTH_BAR_OFFSET);
    }

    public setBodySize(width: number, height: number) {
        this.bodyNode.setSize(width, height);
        this.adjustComponents();
    }

    public setHealth(progress: number) {
        this.healthBar.setProgress(progress);
    }

    public setMana(progress: number) {
        this.manaBar.setProgress(progress);
    }

    public setHealthStage(stage: number) {
        this.healthBar.setStage(stage);
    }

    public setManaStage(stage: number) {
        this.manaBar.setStage(stage);
    }

    public setLevel(level: number) {
        this.levelLabel.string = `Lv.${level}`;
    }

    public setName(name: string) {
        this.nameLabel.string = name;
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
        this.unitAnimator = null;
        this.healthBar.reset();
        this.manaBar.reset();
        this.nameLabel.string = '';
        this.levelLabel.string = '';
        this.node.removeFromParent();
    }

    
    
}
