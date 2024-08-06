import { Command } from "./Command";

export class MacroCommand implements Command {
    private commands: Command[];

    constructor(commands: Command[]) {
        this.commands = commands;
    }

    execute(): void {
        for (const command of this.commands) {
            command.execute();
        }
    }

    undo(): void {
        // 逆序撤销所有命令
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }
    }

    redo(): void {
        for (const command of this.commands) {
            command.redo();
        }
    }

    // 添加新命令到宏命令
    addCommand(command: Command): void {
        this.commands.push(command);
    }

    // 移除最后一个命令
    removeLastCommand(): Command | undefined {
        return this.commands.pop();
    }
}

// 使用示例
// const moveCommand = new MoveCommand(player, 10, 20);
// const attackCommand = {
//     execute: () => console.log("Player attacks!"),
//     undo: () => console.log("Undo attack"),
//     redo: () => console.log("Redo attack")
// };

// const complexAction = new MacroCommand([moveCommand, attackCommand]);

// commandManager.executeCommand(complexAction);
// // 输出:
// // Moved to (10, 20)
// // Player attacks!

// commandManager.undo();
// // 输出:
// // Undo attack
// // Moved to (0, 0)




