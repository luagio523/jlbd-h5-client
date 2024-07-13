import { HeroData } from "../data/HeroData";
import { ECSComponent } from "../ecs/ECSComponent";
import { Attributes } from "../enum/Type";

// AttributeComponent.ts
export class AttributeComponent extends ECSComponent {
    private level: number = 1;
    private primaryAttribute: Attributes;

    private baseStrength: number = 0;
    private baseAgility: number = 0;
    private baseIntelligence: number = 0;

    private strengthGain: number = 0;
    private agilityGain: number = 0;
    private intelligenceGain: number = 0;

    private strength: number = 0;
    private agility: number = 0;
    private intelligence: number = 0;

    private baseArmor: number = 0;
    private baseMagicResistance: number = 0;

    constructor(heroData: HeroData) {
        super();
        this.initializeAttributes(heroData);
        this.updateAttributes();
    }

    private initializeAttributes(heroData: HeroData): void {
        this.primaryAttribute = heroData.GetPrimaryAttribute();
        this.baseStrength = heroData.GetBaseStrength();
        this.baseAgility = heroData.GetBaseAgility();
        this.baseIntelligence = heroData.GetBaseIntelligence();
        this.strengthGain = heroData.GetStrengthGain();
        this.agilityGain = heroData.GetAgilityGain();
        this.intelligenceGain = heroData.GetIntelligenceGain();
        this.baseArmor = heroData.GetBaseArmor();
        this.baseMagicResistance = heroData.GetMagicResistance();
    }

    public getStrength(): number {
        return this.strength;
    }

    public getAgility(): number {
        return this.agility;
    }

    public getIntelligence(): number {
        return this.intelligence;
    }

    public setLevel(level: number): void {
        this.level = level;
        this.updateAttributes();
    }

    public getPrimaryAttributeAsAttackPower(): number {
        switch (this.primaryAttribute) {
            case Attributes.ATTRIBUTE_STRENGTH:
                return this.strength;
            case Attributes.ATTRIBUTE_AGILITY:
                return this.agility;
            case Attributes.ATTRIBUTE_INTELLECT:
                return this.intelligence;
            default:
                return 0;
        }
    }

    public getPrimaryAttribute(): Attributes {
        return this.primaryAttribute;
    }

    public getBaseArmor(): number {
        return this.baseArmor;
    }

    public getBaseMagicResistance(): number {
        return this.baseMagicResistance;
    }

    private updateAttributes(): void {
        this.strength = this.baseStrength + (this.level - 1) * this.strengthGain;
        this.agility = this.baseAgility + (this.level - 1) * this.agilityGain;
        this.intelligence = this.baseIntelligence + (this.level - 1) * this.intelligenceGain;
    }
}
