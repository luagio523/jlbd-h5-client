import { Attribute } from "../enum/Attribute";

export class AttributeComponent {
    public baseStrength: number; // 基础力量值
    public strenghtGain: number; // 每级力量增长值
    public baseAgility: number; // 基础敏捷值
    public agilityGain: number; // 每级敏捷增长值
    public baseIntelligence: number; // 基础智力值
    public intelligenceGain: number; // 每级智力增长值

    public attributePrimary:Attribute; // 主属性，用于确定英雄类型，例如力量、敏捷或智力

    /**
     * 创建 AttributeComponent 实例。
     * @param baseStr 初始力量值。
     * @param strGain 英雄每升一级的力量增长。
     * @param baseAgi 初始敏捷值。
     * @param agiGain 英雄每升一级的敏捷增长。
     * @param baseInt 初始智力值。
     * @param intGain 英雄每升一级的智力增长。
     */
    constructor(baseStr: number, strGain: number, baseAgi: number, agiGain: number, baseInt: number, intGain: number) {
        this.baseStrength = baseStr; // 设置基础力量值
        this.strenghtGain = strGain; // 设置力量增长值
        this.baseAgility = baseAgi; // 设置基础敏捷值
        this.agilityGain = agiGain; // 设置敏捷增长值
        this.baseIntelligence = baseInt; // 设置基础智力值
        this.intelligenceGain = intGain; // 设置智力增长值
    }


    /**
     * 获取基于主属性转换得来的基础攻击力。
     * @returns {number} 基于主属性的基础攻击力数值。
     */
    public getPrimaryAttributeAsAttackPower(): number {
        // 根据主属性的类型，在这里进行检查以返回相应的属性值作为基础攻击力
        switch (this.attributePrimary) {
            case Attribute.ATTRIBUTE_STRENGTH:
                return this.baseStrength; // 如果主属性是力量，返回力量值
            case Attribute.ATTRIBUTE_AGILITY:
                return this.baseAgility; // 如果主属性是敏捷，返回敏捷值
            case Attribute.ATTRIBUTE_INTELLECT:
                return this.baseIntelligence; // 如果主属性是智力，返回智力值
            default:
                return 0; // 如果主属性未定义，返回0
        }
    }
}