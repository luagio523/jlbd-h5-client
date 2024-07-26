export class Cooldown {
    /** 剩余冷却时间 */
    private remainingCooldown: number;
    /** 冷却速率（总冷却时间） */
    private cooldownRate: number;
    /** 是否处于暂停状态 */
    private isPaused: boolean;

    constructor(cooldownRate: number = 0) {
        this.cooldownRate = cooldownRate;
        this.remainingCooldown = 0;
        this.isPaused = false;
    }

    /**
     * 开始一个新的冷却周期
     */
    start(): void {
        this.remainingCooldown = this.cooldownRate;
        this.isPaused = false;
    }

    /**
     * 检查冷却时间并更新
     * @param deltaTime 经过的时间
     * @returns boolean 是否可以进行操作
     */
    check(deltaTime: number): boolean {
        if (this.isPaused) return false;

        this.remainingCooldown = Math.max(0, this.remainingCooldown - deltaTime);
        if (this.remainingCooldown <= 0) {
            this.remainingCooldown = 0;
            return true;
        }
        return false;
    }

    /**
     * 暂停冷却
     */
    pause(): void {
        this.isPaused = true;
    }

    /**
     * 恢复冷却
     */
    resume(): void {
        this.isPaused = false;
    }

    /**
     * 重置冷却时间
     */
    reset(): void {
        this.remainingCooldown = this.cooldownRate;
        this.isPaused = false;
    }

    /**
     * 跳过冷却
     */
    skip(): void {
        this.remainingCooldown = 0;
        this.isPaused = false;
    }

    /**
     * 延长冷却时间
     * @param extension 需要延长的时间
     */
    extend(extension: number): void {
        this.remainingCooldown = Math.max(0, this.remainingCooldown + extension);
    }

    /**
     * 减少冷却时间
     * @param reduction 需要减少的时间
     */
    shorten(reduction: number): void {
        this.remainingCooldown = Math.max(0, this.remainingCooldown - reduction);
    }

    /**
     * 重置冷却速率
     * @param newCooldownRate 新的冷却速率
     */
    resetCooldownRate(newCooldownRate: number): void {
        if (this.cooldownRate === newCooldownRate) return;
        this.cooldownRate = newCooldownRate;
        if (this.remainingCooldown > 0) {
            this.remainingCooldown = Math.min(this.remainingCooldown, this.cooldownRate);
        }
    }

    /**
     * 获取剩余冷却时间
     */
    getRemainingCooldown(): number {
        return this.remainingCooldown;
    }

    /**
     * 获取冷却进度（0-1之间的值）
     */
    getCooldownProgress(): number {
        return 1 - (this.remainingCooldown / this.cooldownRate);
    }

    /**
     * 检查是否处于冷却状态
     */
    isOnCooldown(): boolean {
        return this.remainingCooldown > 0;
    }
}