import { HeroData } from "../data/HeroData";
import { ECSComponent } from "../ecs/ECSComponent";
import { Attributes } from "../enum/Type";

// AttributeComponent.ts
export class AttributeComponent extends ECSComponent {
    private heroData: HeroData;
    private level: number = 1;

    // 直接存储属性值
    private strength: number = 0;
    private agility: number = 0;
    private intelligence: number = 0;
    private baseArmor: number = 0;
    private baseMagicResistance: number = 0;


    constructor(heroData: HeroData) {
        super();
        this.heroData = heroData;
        this.updateAttributes();
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
        switch (this.heroData.GetPrimaryAttribute()) {
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

    public getBaseArmor(): number {
        return this.baseArmor;
    }

    public getBaseMagicResistance(): number {
        return this.baseMagicResistance;
    }

    private updateAttributes(): void {
        this.strength = this.heroData.GetBaseStrength() + (this.level - 1) * this.heroData.GetStrengthGain();
        this.agility = this.heroData.GetBaseAgility() + (this.level - 1) * this.heroData.GetAgilityGain();
        this.intelligence = this.heroData.GetBaseIntelligence() + (this.level - 1) * this.heroData.GetIntelligenceGain();
        this.baseArmor = this.heroData.GetBaseArmor();
        this.baseMagicResistance = this.heroData.GetMagicResistance();
    }
}