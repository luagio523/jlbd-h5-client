import { Node } from 'cc';
import { CharacterAnimator } from './CharacterAnimator';
import { ActAnimationStateFactory, ActionOptions } from './ActAnimationState';
import { AnimResourceType } from '../../core/common/animation/Type';
import { CharacterNode } from './CharacterNode';

export class CharacterRenderer {
    private characterNode: CharacterNode | null = null;
    private characterAnimator: CharacterAnimator | null = null;
    private animResourceType: AnimResourceType | null = null;

    public initialize(type: AnimResourceType) {
        this.animResourceType = type;
    }

    public async setupCharacter(parent?: Node): Promise<void> {
        this.characterNode = new CharacterNode(this.animResourceType!, 100, 100); // 默认尺寸，可以根据需要调整
        if (parent) parent.addChild(this.characterNode.getNode());

        await this.setupComponents();
    }

    private async setupComponents() {
        if (!this.characterNode) {
            console.error("Character node is not initialized.");
            return;
        }

        const bodyNode = this.characterNode.getBodyNode();
        if (bodyNode) {
            const animationState = ActAnimationStateFactory.createPlayer(bodyNode.getNode(), this.animResourceType!);
            this.characterAnimator = new CharacterAnimator(animationState);
        }
    }

    public updateCharacterStatus(name: string, level: number, health: number, mana: number) {
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

    public destroy() {
        if (this.characterNode) {
            this.characterNode.getNode().destroy();
            this.characterNode = null;
        }
        this.characterAnimator = null;
    }

    public getNode(): Node | null {
        return this.characterNode ? this.characterNode.getNode() : null;
    }

    
}
