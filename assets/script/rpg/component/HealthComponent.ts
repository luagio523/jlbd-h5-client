import { ECSComponent } from "../ecs/ECSComponent";




export class HealthComponent extends ECSComponent {
    entityId: string;
    private maxHealth: number;
    private currentHealth: number;
   

    getMaxHealth(): number {
        return this.maxHealth;
    }

    getCurrentHealth(): number {
        return this.currentHealth;
    }

    setMaxHealth(maxHealth: number): void {
        this.maxHealth = maxHealth;
        this.currentHealth = Math.min(this.currentHealth, this.maxHealth);
    }

    heal(amount: number): void {
        this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth);
    }

    takeDamage(amount: number): void {
        this.currentHealth = Math.max(this.currentHealth - amount, 0);
        if (this.currentHealth === 0) {
            // Trigger death event or logic
        }
    }

    isDead(): boolean {
        return this.currentHealth <= 0;
    }

}