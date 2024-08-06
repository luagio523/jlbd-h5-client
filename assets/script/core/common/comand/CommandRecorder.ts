import { Command } from "./Command";
import { MacroCommand } from "./MacroCommand";

export class CommandRecorder {
	private recordedCommands: MacroCommand;
	private isRecording: boolean = false;

	constructor() {
		this.recordedCommands = new MacroCommand([]);
	}

	startRecording(): void {
		this.isRecording = true;
		this.recordedCommands = new MacroCommand([]);
	}

	stopRecording(): MacroCommand {
		this.isRecording = false;
		return this.recordedCommands;
	}

	recordCommand(command: Command): void {
		if (this.isRecording) {
			this.recordedCommands.addCommand(command);
		}
	}

	playRecording(): void {
		this.recordedCommands.execute();
	}
}