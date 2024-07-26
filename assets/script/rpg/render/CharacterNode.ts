import { Node, Label, Sprite, UITransform, Vec3, Color } from 'cc';
import { BaseBodyNode, createBodyNode } from './BodyNode';
import { StatusBar } from './StatusBar';
import { AnimResourceType } from '../../core/common/animation/Type';

export class CharacterNode {
    // 静态常量定义
    private static HEALTH_BAR_OFFSET = 20;
    private static MANA_BAR_OFFSET = 10;
    private static NAME_LABEL_OFFSET = 32;
    private static LEVEL_LABEL_HORIZONTAL_OFFSET = 10;

    private node: Node;
    private bodyNode: BaseBodyNode;
    private shadowNode: Node;
    private healthBar: StatusBar | null = null;
    private manaBar: StatusBar | null = null;
    private levelLabel: Label;
    private nameLabel: Label;

    constructor(bodyType: AnimResourceType, width: number = 100, height: number = 100) {
        this.node = new Node('CharacterNode');
        const transform = this.node.addComponent(UITransform);
        transform.setAnchorPoint(0.5, 0);

        // 初始化 BodyNode
        this.bodyNode = createBodyNode(bodyType, width, height);
        const bodyTransform = this.bodyNode.getNode().getComponent(UITransform);
        if (bodyTransform) {
            bodyTransform.setAnchorPoint(0.5, 0);
        }
        this.node.addChild(this.bodyNode.getNode());

        // 初始化阴影
        this.shadowNode = new Node('Shadow');
        const shadowTransform = this.shadowNode.addComponent(UITransform);
        shadowTransform.setAnchorPoint(0.5, 0);
        const shadowSprite = this.shadowNode.addComponent(Sprite);
        // 设置阴影的 SpriteFrame
        // shadowSprite.spriteFrame = ...;
        this.node.addChild(this.shadowNode);

        // 初始化名字标签
        this.nameLabel = new Node('NameLabel').addComponent(Label);
        this.nameLabel.fontSize = 14; // 设置名字标签的字体大小
        this.node.addChild(this.nameLabel.node);

        // 初始化等级标签
        this.levelLabel = new Node('LevelLabel').addComponent(Label);
        this.levelLabel.fontSize = 10; // 设置等级标签的字体大小
        this.node.addChild(this.levelLabel.node);

        // 初始化生命状态条
        this.healthBar = new StatusBar(100, 10);
        this.node.addChild(this.healthBar.getNode());

        // 初始化魔法进度条
        this.manaBar = new StatusBar(100, 10);
        this.node.addChild(this.manaBar.getNode());

        // 设置初始位置
        this.adjustComponents();
    }

    public static async create(bodyType: AnimResourceType, width: number = 100, height: number = 100): Promise<CharacterNode> {
        const characterNode = new CharacterNode(bodyType, width, height);
        await characterNode.setupCharacterNode();
        return characterNode;
    }

    private async setupCharacterNode() {
        await this.healthBar.setupStatusBar();
        await this.manaBar.setupStatusBar();
    }

    private adjustComponents() {
        const bodyHeight = this.bodyNode.getNode().getComponent(UITransform)?.height || 0;

        // 设置生命状态条位置
        if (this.healthBar) {
            this.healthBar.setPosition(0, bodyHeight + CharacterNode.HEALTH_BAR_OFFSET);
        }

        // 设置魔法进度条位置
        if (this.manaBar) {
            this.manaBar.setPosition(0, bodyHeight + CharacterNode.MANA_BAR_OFFSET);
        }

        // 设置名字标签位置
        this.nameLabel.node.setPosition(0, bodyHeight + CharacterNode.NAME_LABEL_OFFSET);

        // 设置等级标签位置
        const healthBarWidth = this.healthBar?.getNode().getComponent(UITransform)?.width || 0;
        this.levelLabel.node.setPosition(healthBarWidth / 2 + CharacterNode.LEVEL_LABEL_HORIZONTAL_OFFSET, bodyHeight + CharacterNode.HEALTH_BAR_OFFSET);
    }

    public setBodySize(width: number, height: number) {
        this.bodyNode.setSize(width, height);
        this.adjustComponents();
    }

    public setPosition(x: number, y: number, z: number = 0) {
        this.node.setPosition(new Vec3(x, y, z));
    }

    public getNode(): Node {
        return this.node;
    }

    public getBodyNode(): BaseBodyNode {
        return this.bodyNode;
    }

    public setHealth(progress: number) {
        this.healthBar?.setProgress(progress);
    }

    public setMana(progress: number) {
        this.manaBar?.setProgress(progress);
    }

    public setHealthStage(stage: number) {
        this.healthBar?.setStage(stage);
    }

    public setManaStage(stage: number) {
        this.manaBar?.setStage(stage);
    }

    public setLevel(level: number) {
        this.levelLabel.string = `Lv.${level}`;
    }

    public setName(name: string) {
        this.nameLabel.string = name;
    }

    // 静态方法用于设置偏移量
    public static setOffsets(healthBarOffset: number, manaBarOffset: number, nameLabelOffset: number, levelLabelHorizontalOffset: number) {
        CharacterNode.HEALTH_BAR_OFFSET = healthBarOffset;
        CharacterNode.MANA_BAR_OFFSET = manaBarOffset;
        CharacterNode.NAME_LABEL_OFFSET = nameLabelOffset;
        CharacterNode.LEVEL_LABEL_HORIZONTAL_OFFSET = levelLabelHorizontalOffset;
    }
}
