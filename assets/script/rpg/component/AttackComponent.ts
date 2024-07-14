import { Cooldown } from "../base/CoolDown";
import { HeroData } from "../data/HeroData";
import { ECSComponent } from "../ecs/ECSComponent";
import { ECSEntity } from "../ecs/ECSEntity";
import { DamageType } from "../enum/Damage";
import { AttackCapability, AttackType } from "../enum/Type";



export class AttackComponent extends ECSComponent {
    public attackCapability: AttackCapability;
    public baseAttackDamageMin: number;
    public baseAttackDamageMax: number;
    public attackRange: number;
    public attackRate: number;
    private actualAttackRate:number; //实际攻击频率
    public attackAnimationPoint: number;
    public attackAcquisitionRange: number;
    public attackType: AttackType;
    public attackDamageType: DamageType;
    private target: ECSEntity | null = null;
    private attacksMade: number = 0;
    private attackCooldown: Cooldown;

    constructor(heroData: HeroData) {
        super();
        this.initializeAttack(heroData);
    }
   

    private initializeAttack(heroData: HeroData): void {
        this.attackCapability = this.determineAttackCapability(heroData.GetAttackRange());
        [this.baseAttackDamageMin, this.baseAttackDamageMax] = heroData.GetAttackDamage();
        this.attackRange = heroData.GetAttackRange();
        this.attackRate = heroData.GetAttackRate();
        this.attackAnimationPoint = heroData.GetAttackAnimationPoint();
        this.attackAcquisitionRange = heroData.GetAttackAcquisitionRange();
        this.attackType = heroData.GetAttackType();
        this.attackDamageType = heroData.GetAttackDamageType();
        this.attackCooldown = new Cooldown(this.attackRate);
    }

    private determineAttackCapability(attackRange: number): AttackCapability {
        return attackRange > 150 ? AttackCapability.UNIT_CAP_RANGED_ATTACK : AttackCapability.UNIT_CAP_MELEE_ATTACK;
    }

    public getBaseAttackDamage(): number {
        return Math.random() * (this.baseAttackDamageMax - this.baseAttackDamageMin) + this.baseAttackDamageMin;
    }

    public getAttackRange(): number {
        return this.attackRange;
    }

    public getBaseAttackRate(): number {
        return  this.attackRate;
    }
    

    public setTarget(target: ECSEntity | null): void {
        this.target = target;
    }

    public getTarget(): ECSEntity | null {
        return this.target;
    }

    public canAttack(deltaTime: number): boolean {
        return this.attackCooldown.check(deltaTime);
    }

    public updateAttackRate(attackRate: number): void {
        this.actualAttackRate = attackRate;
        this.attackCooldown.resetCooldownRate(attackRate);
    }

    public performAttack(): void {
        if (this.canAttack(0)) {
            this.attacksMade++;
            this.attackCooldown.start();
        }
    }

    public getAttacksMade(): number {
        return this.attacksMade;
    }

    public getActualAttackRate(): number {
        return this.actualAttackRate;
    }

    public getAttackAnimationPoint(): number {
        return this.attackAnimationPoint;
    }

    public getAttackAcquisitionRange(): number {
        return this.attackAcquisitionRange;
    }

    public getAttackType(): AttackType {
        return this.attackType;
    }

    public getAttackDamageType(): DamageType {
        return this.attackDamageType;
    }

    public resetAttacksMade(): void {
        this.attacksMade = 0;
    }

    public isInAcquisitionRange(distance: number): boolean {
        return distance <= this.attackAcquisitionRange;
    }

    public isInAttackRange(distance: number): boolean {
        return distance <= this.attackRange;
    }
}


