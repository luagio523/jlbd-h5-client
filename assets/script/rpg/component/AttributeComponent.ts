import { AbilityData } from "../ability/AbilityData";
import { ECSComponent } from "../ecs/ECSComponent";
import { Attribute } from "../enum/Attribute";


export class AttributeComponent extends ECSComponent {
    public baseStrength: number;
    public strengthGain: number;
    public baseAgility: number;
    public agilityGain: number;
    public baseIntelligence: number;
    public intelligenceGain: number;

    public attributePrimary: Attribute;

    private level: number = 1;
    private abilityData: AbilityData;

    constructor( abilityData: AbilityData) {
        super();
        this.abilityData = abilityData;

        // 从 AbilityData 中初始化属性
        this.baseStrength = this.abilityData.GetLevelSpecialValueFor('base_strength', 1);
        this.strengthGain = this.abilityData.GetLevelSpecialValueFor('strength_gain', 1);
        this.baseAgility = this.abilityData.GetLevelSpecialValueFor('base_agility', 1);
        this.agilityGain = this.abilityData.GetLevelSpecialValueFor('agility_gain', 1);
        this.baseIntelligence = this.abilityData.GetLevelSpecialValueFor('base_intelligence', 1);
        this.intelligenceGain = this.abilityData.GetLevelSpecialValueFor('intelligence_gain', 1);

        // 设置主属性
        this.attributePrimary = this.parseAttributePrimary(this.abilityData.GetLevelSpecialValueFor('attribute_primary', 1));
    }

    private parseAttributePrimary(value: number): Attribute {
        switch (value) {
            case 0: return Attribute.ATTRIBUTE_STRENGTH;
            case 1: return Attribute.ATTRIBUTE_AGILITY;
            case 2: return Attribute.ATTRIBUTE_INTELLECT;
            default: throw new Error("Invalid attribute primary value");
        }
    }

    public getStrength(): number {
        return this.baseStrength + (this.level - 1) * this.strengthGain;
    }

    public getAgility(): number {
        return this.baseAgility + (this.level - 1) * this.agilityGain;
    }

    public getIntelligence(): number {
        return this.baseIntelligence + (this.level - 1) * this.intelligenceGain;
    }

    public setLevel(level: number): void {
        this.level = level;
    }

    public getPrimaryAttributeAsAttackPower(): number {
        switch (this.attributePrimary) {
            case Attribute.ATTRIBUTE_STRENGTH:
                return this.getStrength();
            case Attribute.ATTRIBUTE_AGILITY:
                return this.getAgility();
            case Attribute.ATTRIBUTE_INTELLECT:
                return this.getIntelligence();
            default:
                return 0;
        }
    }

    public getBaseArmor(): number {
        return this.abilityData.GetLevelSpecialValueFor('base_armor', this.level);
    }

    public getBaseMagicResistance(): number {
        return this.abilityData.GetLevelSpecialValueFor('base_magic_resistance', this.level);
    }

    // 其他可能需要的方法...
}


