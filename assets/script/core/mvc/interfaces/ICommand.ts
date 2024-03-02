import { INotification } from "./INotification";
import { INotifier } from "./INotifier";

	
	export interface ICommand
		extends INotifier
	{
		
		execute( notification:INotification ):void;
	}
