import { ECSComponent } from "../ecs/ECSComponent";




export class HealthComponent extends ECSComponent {
    currentHealth: number;    // 当前生命值
    maxHealth: number;        // 最大生命值
    isInvulnerable: boolean;  // 是否无敌状态
    isDead: boolean;          // 是否已死亡

    constructor(maxHealth: number) {
        super()
        this.currentHealth = maxHealth;
        this.maxHealth = maxHealth;
        this.isInvulnerable = false;
        this.isDead = false;
    }

    takeDamage(amount: number) {
        if (!this.isInvulnerable && !this.isDead) {
            this.currentHealth -= amount;
        }
    }

    heal(amount: number) {
        if (!this.isDead) {
            this.currentHealth += amount;
            if (this.currentHealth > this.maxHealth) {
                this.currentHealth = this.maxHealth;
            }
        }
    }

    die() {
        this.isDead = true;
        this.currentHealth = 0;
    }

}