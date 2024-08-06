import { Command } from "./Command";
import { CommandRecorder } from "./CommandRecorder";

export class CommandManager {
    private commandHistory: Command[] = [];
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];
    private recorder: CommandRecorder | null = null;

    setRecorder(recorder: CommandRecorder | null): void {
        this.recorder = recorder;
    }

    executeCommand(command: Command): void {
        command.execute();
        this.commandHistory.push(command);
        this.undoStack.push(command);
        this.redoStack = []; // 清空重做栈

        // 如果有记录器，通知它新命令被执行
        if (this.recorder) {
            this.recorder.recordCommand(command);
        }
    }

    undo(): void {
        if (this.undoStack.length > 0) {
            const command = this.undoStack.pop()!;
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo(): void {
        if (this.redoStack.length > 0) {
            const command = this.redoStack.pop()!;
            command.redo();
            this.undoStack.push(command);
        }
    }

    getHistory(): Command[] {
        return this.commandHistory;
    }
}





// // 创建命令管理器和命令记录器
// const commandManager = new CommandManager();
// const commandRecorder = new CommandRecorder();

// // 设置记录器
// commandManager.setRecorder(commandRecorder);

// // 开始记录
// commandRecorder.startRecording();

// // 执行一系列命令
// commandManager.executeCommand(new MoveCommand(player, 10, 20));
// commandManager.executeCommand(new MoveCommand(player, 30, 40));

// // 停止记录
// const recordedMacro = commandRecorder.stopRecording();

// // 移除记录器（如果不再需要记录）
// commandManager.setRecorder(null);

// // 稍后，我们可以重放这些操作
// recordedMacro.execute();

// // 创建命令管理器
// const commandManager = new CommandManager();

// // 创建并执行移动命令
// const moveCommand1 = new MoveCommand(player, 10, 20);
// commandManager.executeCommand(moveCommand1); // 输出: Moved to (10, 20)

// const moveCommand2 = new MoveCommand(player, 30, 40);
// commandManager.executeCommand(moveCommand2); // 输出: Moved to (30, 40)

// // 撤销命令
// commandManager.undo(); // 输出: Moved to (10, 20)
// commandManager.undo(); // 输出: Moved to (0, 0)

// // 重做命令
// commandManager.redo(); // 输出: Moved to (10, 20)
// commandManager.redo(); // 输出: Moved to (30, 40)

// // 获取命令历史
// console.log(commandManager.getHistory()); // 输出命令历史