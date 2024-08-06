import { Command } from "./Command";

export class ConditionalCommand implements Command {
    private condition: () => boolean;
    private command: Command;

    constructor(condition: () => boolean, command: Command) {
        this.condition = condition;
        this.command = command;
    }

    execute(): void {
        if (this.condition()) {
            this.command.execute();
        } else {
            console.log("Condition not met, command not executed.");
        }
    }

    undo(): void {
        // 只有在条件满足且命令已执行的情况下才能撤销
        if (this.condition()) {
            this.command.undo();
        }
    }

    redo(): void {
        this.execute();
    }
}

// // 使用示例
// const player = {
//     gold: 100,
//     spendGold(amount: number) {
//         if (this.gold >= amount) {
//             this.gold -= amount;
//             return true;
//         }
//         return false;
//     }
// };

// const buyItemCommand = new ConditionalCommand(
//     () => player.gold >= 50,
//     {
//         execute: () => {
//             player.spendGold(50);
//             console.log("Item purchased!");
//         },
//         undo: () => {
//             player.gold += 50;
//             console.log("Purchase undone.");
//         },
//         redo: () => {
//             player.spendGold(50);
//             console.log("Item re-purchased!");
//         }
//     }
// );

// commandManager.executeCommand(buyItemCommand);