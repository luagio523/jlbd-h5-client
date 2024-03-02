import { INotification } from "./INotification";

	export interface IObserver
	{
		
		setNotifyMethod( notifyMethod:Function ):void;
		
		setNotifyContext( notifyContext:any ):void;
		
		
		notifyObserver( notification:INotification ):void;
		
		compareNotifyContext( object:any ):boolean;
	}
