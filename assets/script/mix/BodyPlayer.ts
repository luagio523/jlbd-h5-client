class BodyPlayer {
    private currentAction: ActType;
    private direction: number; // 0-7 代表8个方向
    private parser: IAnimationParser;

    constructor(parser: IAnimationParser) {
        this.parser = parser;
        this.currentAction = ActType.ACT_IDLE;
        this.direction = 0; // 默认方向
    }

    public setParser(parser: IAnimationParser) {
        this.parser = parser;
    }

    public setAction(action: ActType) {
        this.currentAction = action;
        this.playAnimation();
    }

    public setDirection(direction: number) {
        this.direction = direction;
        this.playAnimation();
    }

    private playAnimation() {
        const animation = this.parser.getAnimation(this.currentAction, this.direction);
        if (animation) {
            this.play(animation);
        }
    }

    private play(animation: any) {
        // 播放动画的具体实现
        console.log(`Playing animation: ${animation}`);
    }
}