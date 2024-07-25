import { Prefab, instantiate, Node, Label, Sprite, resources, tween, sp, dragonBones, Component } from 'cc';
import { ResPathUtil } from '../util/ResPathUtil';
import { AnimResourceType } from '../../core/common/animation/Type';
import { ComponentUtil } from '../util/ComponentUil';
import {  ActAnimationStateFactory, ActionOptions } from './ActAnimationState';
import {  CharacterAnimator } from './CharacterAnimator';

export class CharacterRenderer {
    private characterNode: Node | null = null;
    private nameLabel: Label | null = null;
    private healthBar: Sprite | null = null;
    private manaBar: Sprite | null = null;
    private characterAnimator: CharacterAnimator | null = null;
    private animResourceType: AnimResourceType | null = null;

    public initialize(type: AnimResourceType) {
        this.animResourceType = type;
    }

    public async setupBody(parent?: Node): Promise<void> {
        const actBodyPath = ResPathUtil.getBodyActPrefabPath(this.animResourceType);
    
        try {
            const prefab = await this.loadPrefab(actBodyPath);
            this.createBodyNode(prefab, parent);
            this.setupComponents();
            this.setupCharacterAnimator();
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
        this.healthBar = ComponentUtil.getComponentFromChild(this.characterNode, 'HealthBar', Sprite);
        this.manaBar = ComponentUtil.getComponentFromChild(this.characterNode, 'ManaBar', Sprite);
    }

    private setupCharacterAnimator() {
        if (!this.characterNode) {
            console.error("Character node is not initialized.");
            return;
        }
        let bodyNode = this.characterNode.getChildByName('Body');
        if (!bodyNode) {
            console.error("Body node not found.");
            return;
        }
        const animationState = ActAnimationStateFactory.createPlayer(bodyNode, this.animResourceType!);
        this.characterAnimator = new CharacterAnimator(animationState);
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
            tween(bar)
                .to(0.5, { fillRange: progress }, {
                    easing: 'quartOut'
                })
                .start();
        }
    }

    public updatePosition(x: number, y: number) {
        if (this.characterNode) {
            this.characterNode.setPosition(x, y);
        }
    }

    public async playAction(options: ActionOptions) {
        if (this.characterAnimator) {
            const animationStateType = this.characterAnimator.mapActionToAnimationStateType(options.action);
            this.characterAnimator.transitionToState(animationStateType, options);
        }
    }


    public update(dt: number) {
        if (this.characterAnimator) {
            this.characterAnimator.update(dt);
        }
    }

    public destroy() {
        if (this.characterNode) {
            this.characterNode.destroy();
            this.characterNode = null;
        }
        this.characterAnimator = null;
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
