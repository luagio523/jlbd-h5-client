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

}