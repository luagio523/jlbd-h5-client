interface IAnimationPlayer {
    loadAnimation(...args: any[]): Promise<void>;
    setupAnimation(key?: string): void;
    play(): void;
    stop(): void;
    setUpdateGap(gap: number): void;
    setAnimeTimes(times: number): void;
    setOnCompleteCallback(callback: Function): void;
    update(dt: number): void;
}