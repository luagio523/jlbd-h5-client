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

// // 使用示例
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
// 输出:
// Undo attack
// Moved to (0, 0)
  
//   // 使用示例
//   const moveCommand3 = new MoveCommand(player, 50, 60);
//   const moveCommand4 = new MoveCommand(player, 70, 80);
//   const macroCommand = new MacroCommand([moveCommand3, moveCommand4]);
  
//   commandManager.executeCommand(macroCommand); // 执行一系列命令




// class MoveCommand implements Command {
//     private receiver: any;
//     private x: number;
//     private y: number;
//     private previousX: number;
//     private previousY: number;
  
//     constructor(receiver: any, x: number, y: number) {
//       this.receiver = receiver;
//       this.x = x;
//       this.y = y;
//       this.previousX = receiver.x;
//       this.previousY = receiver.y;
//     }
  
//     execute(): void {
//       this.previousX = this.receiver.x;
//       this.previousY = this.receiver.y;
//       this.receiver.moveTo(this.x, this.y);
//     }
  
//     undo(): void {
//       this.receiver.moveTo(this.previousX, this.previousY);
//     }
  
//     redo(): void {
//       this.execute();
//     }
//   }