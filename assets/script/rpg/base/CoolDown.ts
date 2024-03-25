export class Cooldown {
    /** 冷却时间 */
    private remainingCooldown: number
    /** 冷却速率 */
    private cooldownRate: number

    constructor(cooldownRate?: number) {
        this.cooldownRate = cooldownRate;
        this.remainingCooldown = 0;
    }

    /**
    * 检查冷却时间
    * @param deltaTime
    * @returns boolean 决定是否可以进行操作
    */
    check(deltaTime: number): boolean {
        this.remainingCooldown -= deltaTime;
        if (this.remainingCooldown <= 0) {
            this.remainingCooldown = this.cooldownRate;
            return true;
        }

        return false;
    }


    /**
    * 暂停冷却
    */
    pause(): void {
        this.remainingCooldown = this.remainingCooldown;
    }

    /**
    * 恢复冷却
    */
    resume(): void {
        this.remainingCooldown = this.remainingCooldown;
    }

    /**
    * 跳过冷却
    */
    skip(): void {
        this.remainingCooldown = 0;
    }

    /**
    * 延长冷却时间
    * @param extension 需要延长的时间
    */
    extend(extension: number): void {
        this.remainingCooldown += extension;
    }

    /**
    * 减少冷却时间
    * @param reduction 需要减少的时间
    */
    shorten(reduction: number): void {
        this.remainingCooldown = Math.max(0, this.remainingCooldown - reduction);
    }

    /**
     * 重置冷却时间
     */
    reset(): void {
        this.remainingCooldown = this.cooldownRate;
    }


    resetCooldownRate(newCooldownRate: number): void {
        if(this.cooldownRate == newCooldownRate) return 
        // let proportion = this.remainingCooldown / this.cooldownRate;
        this.cooldownRate = newCooldownRate;
        // this.remainingCooldown = proportion * this.cooldownRate;
    }
}