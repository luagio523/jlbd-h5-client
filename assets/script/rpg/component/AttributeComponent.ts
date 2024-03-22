export class AttributeComponent {
    baseStrength: number;
    strenghtGain: number;
    baseAgility: number;
    agilityGain: number;
    baseIntelligence: number;
    intelligenceGain: number;

    constructor(baseStr: number, strGain: number, baseAgi: number, agiGain: number, baseInt: number, intGain: number) {
        this.baseStrength = baseStr;
        this.strenghtGain = strGain;
        this.baseAgility = baseAgi;
        this.agilityGain = agiGain;
        this.baseIntelligence = baseInt;
        this.intelligenceGain = intGain;
    }
}