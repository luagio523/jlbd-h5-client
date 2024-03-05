import { ICommand } from "../../interfaces/ICommand";
import { INotification } from "../../interfaces/INotification";
import { INotifier } from "../../interfaces/INotifier";
import { Notifier } from "../observer/Notifier";


	
	export class SimpleCommand
		extends Notifier
		implements ICommand, INotifier
	{
		
		execute( notification:INotification ):void
		{

		}
	}
