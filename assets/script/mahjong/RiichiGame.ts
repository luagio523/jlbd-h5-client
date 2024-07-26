// RiichiGame.ts

import { Player } from './Player';
import { Wall } from './Wall';
import { Tile } from './Tile';
import { BuildTransition, ITransitions, StateMachine } from '../core/common/fsm/StateMachine';


// export enum GameState{
//     Initializing,
//     Dealing,
//     WaitingForPlayer,
//     RoundEnded,
//     GameEnded
// }

// GameState.ts

export enum GameState {
    Initializing,
    Dealing,
    WaitingForDiscard,
    WaitingForAction,
    Discarded,
    Chow,  // 吃
    Pung,  // 碰
    Kong,  // 杠
    RoundEnded,
    GameEnded
}



export const GameTransitions: ITransitions<any, GameState> = {
    startDealing: BuildTransition(GameState.Initializing, GameState.Dealing),
    startWaitingForDiscard: BuildTransition(GameState.Dealing, GameState.WaitingForDiscard),
    discard: BuildTransition(GameState.WaitingForDiscard, GameState.Discarded),
    waitForAction: BuildTransition(GameState.Discarded, GameState.WaitingForAction),
    chow: BuildTransition(GameState.WaitingForAction, GameState.Chow),
    pung: BuildTransition(GameState.WaitingForAction, GameState.Pung),
    kong: BuildTransition(GameState.WaitingForAction, GameState.Kong),
    continuePlay: BuildTransition([GameState.Discarded, GameState.Chow, GameState.Pung, GameState.Kong], GameState.WaitingForDiscard),
    endRound: BuildTransition(GameState.WaitingForDiscard, GameState.RoundEnded),
    startNextRound: BuildTransition(GameState.RoundEnded, GameState.WaitingForDiscard),
    endGame: BuildTransition(GameState.WaitingForDiscard, GameState.GameEnded)
};


// RiichiGame.ts


export class RiichiGame {
    players: Player[] = [];
    wall: Wall;
    dora: Tile[] = [];
    stateMachine: StateMachine<any, GameState>;
    currentPlayerIndex: number = 0;
    lastDiscardedTile: Tile | null = null;

    constructor(playerCount: number) {
        if (playerCount < 2 || playerCount > 4) {
            throw new Error('玩家数量必须是2到4人');
        }

        this.wall = new Wall();
        for (let i = 0; i < playerCount; i++) {
            this.players.push(new Player());
        }

        this.stateMachine = new StateMachine({
            init: GameState.Initializing,
            transitions: GameTransitions,
            onBefore: this.onBeforeTransition.bind(this),
            onAfter: this.onAfterTransition.bind(this),
            onError: this.onErrorTransition.bind(this)
        });

        this.start();
    }

    start(): void {
        this.stateMachine.transition().startDealing();
    }

    private dealTiles(): void {
        // 发牌分为三轮
        for (let round = 0; round < 3; round++) {
            // 每轮，所有玩家依次抽牌
            for (let player of this.players) {
                // 每个玩家每轮抽4张牌
                for (let i = 0; i < 4; i++) {
                    const tile = this.wall.draw();
                    if (tile) {
                        player.drawTile(tile);
                    }
                }
            }
        }
    
        // 发完三轮后，每个玩家再抽一张牌
        for (let player of this.players) {
            const tile = this.wall.draw();
            if (tile) {
                player.drawTile(tile);
            }
        }
    
        // 发牌结束，转换状态为等待玩家出牌
        this.stateMachine.transition().startWaitingForDiscard();
    }
    

    playTurn(): void {
        if (!this.stateMachine.is(GameState.WaitingForDiscard)) {
            throw new Error('游戏未在等待玩家出牌');
        }

        const player = this.players[this.currentPlayerIndex];
        const drawnTile = this.wall.draw();

        if (drawnTile) {
            player.drawTile(drawnTile);
            const discardedTile = this.playerChooseDiscard(player);
            this.lastDiscardedTile = discardedTile;
            this.stateMachine.transition().discard();
            this.stateMachine.transition().waitForAction();
        } else {
            this.stateMachine.transition().endRound();
        }
    }

    private playerChooseDiscard(player: Player): Tile {
        const randomIndex = Math.floor(Math.random() * player.hand.length);
        const discardedTile = player.hand[randomIndex];
        player.discardTile(discardedTile);
        return discardedTile;
    }

    handleOtherPlayersAction(): void {
        if (!this.stateMachine.is(GameState.WaitingForAction)) {
            throw new Error('游戏未在等待玩家动作');
        }

        for (let i = 1; i < this.players.length; i++) {
            const playerIndex = (this.currentPlayerIndex + i) % this.players.length;
            const player = this.players[playerIndex];

            if (player.canKong(this.lastDiscardedTile!)) {
                this.stateMachine.transition().kong();
                player.performKong(this.lastDiscardedTile!);
                this.currentPlayerIndex = playerIndex;
                return;
            }

            if (player.canPung(this.lastDiscardedTile!)) {
                this.stateMachine.transition().pung();
                player.performPung(this.lastDiscardedTile!);
                this.currentPlayerIndex = playerIndex;
                return;
            }

            if (player.canChow(this.lastDiscardedTile!)) {
                this.stateMachine.transition().chow();
                player.performChow(this.lastDiscardedTile!);
                this.currentPlayerIndex = playerIndex;
                return;
            }
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.stateMachine.transition().continuePlay();
    }

    private onBeforeTransition(from: GameState, to: GameState): void {
        console.log(`状态从 ${from} 转换到 ${to}`);
    }

    private onAfterTransition(from: GameState, to: GameState): void {
        console.log(`状态已从 ${from} 转换到 ${to}`);
        switch (to) {
            case GameState.Dealing:
                this.dealTiles();
                break;
            case GameState.WaitingForDiscard:
                this.playTurn();
                break;
            case GameState.WaitingForAction:
                this.handleOtherPlayersAction();
                break;
            case GameState.RoundEnded:
                this.endRound();
                break;
            case GameState.GameEnded:
                this.endGame();
                break;
        }
    }

    private onErrorTransition(code: number, reason: string): void {
        console.error(`状态转换错误: ${reason} (错误码: ${code})`);
    }

    private endRound(): void {
        console.log('一轮结束');
        // 这里可以添加一轮结束后的逻辑
        this.stateMachine.transition().startNextRound();
    }

    private endGame(): void {
        console.log('游戏结束');
        // 这里可以添加游戏结束后的逻辑
    }

    getState(): GameState {
        return this.stateMachine.state();
    }

    getCurrentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    // 用于测试和调试的方法
    setPlayerHand(playerIndex: number, hand: Tile[]): void {
        if (playerIndex < 0 || playerIndex >= this.players.length) {
            throw new Error('无效的玩家索引');
        }
        this.players[playerIndex].hand = hand;
    }

    setLastDiscardedTile(tile: Tile): void {
        this.lastDiscardedTile = tile;
    }
}






// // 创建游戏实例
// const game = new RiichiGame(4);

// // 模拟发牌，给第二个玩家三张8条
// game.players[1].hand = [
//   new Tile(TileType.Sou, 8),
//   new Tile(TileType.Sou, 8),
//   new Tile(TileType.Sou, 8),
//   // ... 其他牌
// ];

// // 模拟第一个玩家打出8条
// game.currentPlayerIndex = 0;
// game.lastDiscardedTile = new Tile(TileType.Sou, 8);
// console.log("玩家0打出了8条");

// // 处理其他玩家的动作
// game.handleOtherPlayersAction();

// // 检查结果
// console.log(`当前玩家索引: ${game.currentPlayerIndex}`);
// console.log(`玩家1的面子: ${game.players[1].melds.map(meld => meld.map(tile => tile.toString()).join(','))}`);
// console.log(`玩家1的手牌: ${game.players[1].hand.map(tile => tile.toString()).join(',')}`);