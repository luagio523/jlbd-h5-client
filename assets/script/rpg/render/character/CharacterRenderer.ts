import { Color, Node } from 'cc';

import { AnimResourceType } from '../../../core/animation/Type';
import { CharacterNode } from './CharacterNode';
import { CharacterAnimator } from '../../base/CharacterAnimator';
import { ActAnimationStateFactory, ActionOptions } from '../../base/ActAnimationState';
import { UIElement } from '../UIElement';


export class CharacterRenderer extends UIElement {
    private characterNode: CharacterNode | null = null;
    private characterAnimator: CharacterAnimator | null = null;
    private animResourceType: AnimResourceType | null = null;

    public constructor(type:AnimResourceType,width: number=400, height: number=400) {
        super("CharacterRenderer", width, height);
        this.animResourceType = type;
        this.characterNode = CharacterNode.create(this.animResourceType!, 100, 100); // 默认尺寸，可以根据需要调整
        const bodyNode = this.characterNode.getNode();
        const animationState = ActAnimationStateFactory.createPlayer(bodyNode, this.animResourceType!);
        this.characterAnimator = new CharacterAnimator(animationState);
    }
   

    public async setup(): Promise<void> {
        console.log("Setting up character...");
        if (!this.characterNode) {
            console.error("Character node is not initialized.");
            return;
        }
        await this.characterNode.setup();
    }

 
    public updateCharacterStatus(name: string, level: number = 1, health: number = 0, mana: number = 0) {
        if (this.characterNode) {
            this.characterNode.setName(name);
            this.characterNode.setLevel(level);
            this.characterNode.setHealth(health);
            this.characterNode.setMana(mana);
        }
    }

    public updatePosition(x: number, y: number) {
        if (this.characterNode) {
            this.characterNode.setPosition(x, y);
        }
    }

    public async playAction(options: ActionOptions) {
        if (this.characterAnimator) {
            this.characterAnimator.transitionToState(options);
        }
    }

    public setBodySize(width: number, height: number) {
        if (this.characterNode) {
            this.characterNode.setBodySize(width, height);
        }
    }

    public update(dt: number) {
        if (this.characterAnimator) {
            this.characterAnimator.update(dt);
        }
    }

    public reset(): void {
        if (this.characterNode) {
            this.characterNode.reset();
            this.characterNode = null;
        }
        this.characterAnimator = null;
    }


    public getNode(): Node | null {
        return this.characterNode ? this.characterNode.getNode() : null;
    }
}
