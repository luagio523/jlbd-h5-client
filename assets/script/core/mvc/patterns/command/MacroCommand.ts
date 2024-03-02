import { ICommand } from "../../interfaces/ICommand";
import { INotification } from "../../interfaces/INotification";
import { INotifier } from "../../interfaces/INotifier";
import { Notifier } from "../observer/Notifier";

	
	export class MacroCommand
		extends Notifier
		implements ICommand, INotifier
	{
		
		subCommands:Function[] = null;
		
		
		constructor()
		{
			super();

			this.subCommands = new Array<Function>();
			this.initializeMacroCommand();
		}

		
		initializeMacroCommand():void
		{
		
		}

		
		addSubCommand( commandClassRef:Function ):void
		{
			this.subCommands.push(commandClassRef);
		}

		
		execute( notification:INotification ):void
		{
			var	subCommands:Function[] = this.subCommands.slice(0);
			var	len:number = this.subCommands.length;
			for( var i:number=0; i<len; i++ )
			{
				/*
				 * Typed any here instead of <code>Function</code> ( won't compile if set to Function
				 * because today the compiler consider that <code>Function</code> is not newable and
				 * doesn't have a <code>Class</code> type)
				 */
				var commandClassRef:any = subCommands[i];
				var commandInstance:ICommand = <ICommand> /*</>*/ new commandClassRef();
				commandInstance.initializeNotifier( this.multitonKey );
				commandInstance.execute( notification );
			}
			
			this.subCommands.splice(0);
		}
	}
