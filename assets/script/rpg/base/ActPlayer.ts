
// 抽象基类
abstract class ActPlayer {
    protected player: MCPlayer;
    protected isLooping: boolean = false;
    protected onCompleteCallback: (() => void) | null = null;

    abstract initialize(modelName: string, gender: number, direction: number, action: ActType): Promise<void>;
    abstract getMCKey(modelName: string, gender: number, direction: number, action: ActType): string;

    // 共用方法
    play(looping: boolean = false, onComplete: (() => void) | null = null) {
        this.setLooping(looping);
        this.setOnCompleteCallback(onComplete);
        this.player.play();
    }

    stop() { this.player.stop(); }
    pause() { this.player.pause(); }
    resume() { this.player.resume(); }
    setUpdateGap(gap: number) { this.player.setUpdateGap(gap); }
    setAnimeTimes(times: number) { this.player.setAnimeTimes(times); }
    setEasingFunction(easingFunction: (t: number) => number) { this.player.setEasingFunction(easingFunction); }

    setLooping(looping: boolean) {
        this.isLooping = looping;
        this.player.setAnimeTimes(looping ? 0 : 1);
    }

    setOnCompleteCallback(callback: (() => void) | null) {
        this.onCompleteCallback = callback;
        this.player.setOnCompleteCallback(() => {
            if (this.onCompleteCallback) {
                this.onCompleteCallback();
            }
            if (!this.isLooping) {
                this.stop();
            }
        });
    }

    protected abstract getActionName(action: ActType): string;
}

// Act1Player 实现
class Act1Player extends ActPlayer {
    constructor() {
        super();
        const loader = new SpriteAtlasLoader();
        this.player = new MCPlayer(loader);
    }

    async initialize(modelName: string, gender: number = 1, direction: number = 0, action: ActType = ActType.ACT_IDLE): Promise<void> {
        let mc = this.getMCKey(modelName, gender, direction, action);
        let jsonPath = `anim/body/${mc}.json`;
        let imgPath = `anim/body/${mc}.png`;
        await this.player.loadAnimation(jsonPath, imgPath);
        this.player.setupMovieClip(mc);

        // 设置默认的循环行为
        this.setLooping(this.shouldLoop(action));
    }

    getMCKey(modelName: string, gender: number = 1, direction: number, action: ActType): string {
        const actionName = this.getActionName(action);
        return `${modelName}_${actionName}`;
    }

    protected getActionName(action: ActType): string {
        // Act1Player 特定的动作名映射
        const actionMap: { [key in ActType]?: string } = {
            [ActType.ACT_IDLE]: 's',
            [ActType.ACT_WALK]: 'r',
            [ActType.ACT_RUN]: 'r',
            [ActType.ACT_ATTACK]: 'a',
            [ActType.ACT_CAST]: 'j',
            [ActType.ACT_DEATH]: 'S',
        };
        return actionMap[action] || 's';
    }

    private shouldLoop(action: ActType): boolean {
        // 定义哪些动作应该循环
        const loopingActions = [ActType.ACT_IDLE, ActType.ACT_WALK, ActType.ACT_RUN];
        return loopingActions.includes(action);
    }
}

// Act2Player 实现
class Act2Player extends ActPlayer {
    constructor() {
        super();
        const sheetLoader = new SpriteSheetLoader();
        this.player = new MCPlayer(sheetLoader);
    }

    async initialize(modelName: string, gender: number = 1, direction: number = 0, action: ActType = ActType.ACT_IDLE): Promise<void> {
        let mc = this.getMCKey(modelName, gender, direction, action);
        let jsonPath = `anim/sheetbody/${mc}.json`;
        let imgPath = `anim/sheetbody/${mc}.png`;
        await this.player.loadAnimation(jsonPath, imgPath);
        this.player.setupMovieClip(mc);

        // 设置默认的循环行为
        this.setLooping(this.shouldLoop(action));
    }

    getMCKey(modelName: string, gender: number = 1, direction: number, action: ActType): string {
        const actionName = this.getActionName(action);
        return `${modelName}_${gender}_${direction}${actionName}`;
    }

    protected getActionName(action: ActType): string {
        // Act2Player 特定的动作名映射
        const actionMap: { [key in ActType]?: string } = {
            [ActType.ACT_IDLE]: 's',
            [ActType.ACT_WALK]: 'r',
            [ActType.ACT_RUN]: 'r',
            [ActType.ACT_ATTACK]: 'a',
            [ActType.ACT_CAST]: 'c',
        };
        return actionMap[action] || 's';
    }

    private shouldLoop(action: ActType): boolean {
        // 定义哪些动作应该循环
        const loopingActions = [ActType.ACT_IDLE, ActType.ACT_WALK, ActType.ACT_RUN];
        return loopingActions.includes(action);
    }
}

// 使用示例
(async () => {
    const player = new Act1Player();
    await player.initialize("character", 1, 0, ActType.ACT_IDLE);

    // 播放循环动作（如待机）
    player.play(true);

    // 播放非循环动作（如攻击），并在完成后执行回调
    player.play(false, () => {
        console.log("攻击动作完成");
        // 这里可以切换回待机动作或执行其他逻辑
    });

    // 如果需要中途改变循环状态
    player.setLooping(true);

    // 如果需要中途改变完成回调
    player.setOnCompleteCallback(() => {
        console.log("新的完成回调");
    });
})();


// 工厂类
class ActPlayerFactory {
    static createPlayer(type: 'Act1' | 'Act2'): ActPlayer {
        switch (type) {
            case 'Act1':
                return new Act1Player();
            case 'Act2':
                return new Act2Player();
            default:
                throw new Error('Unsupported player type');
        }
    }
}

// 使用示例
async function useActPlayer() {
    const player = ActPlayerFactory.createPlayer('Act1');
    await player.initialize('character001', 1, 0, ActType.ACT_IDLE);
    player.play();
}








