import { INotification } from "../../interfaces/INotification";
import { IObserver } from "../../interfaces/IObserver";

	
	export class Observer
		implements IObserver
	{
		
		private notify:Function = null;

		
		private context:any = null;

		
		constructor( notifyMethod:Function, notifyContext:any )
		{
			this.setNotifyMethod( notifyMethod );
			this.setNotifyContext( notifyContext );
		}

		
		private getNotifyMethod():Function
		{
			return this.notify;
		}

		
		setNotifyMethod( notifyMethod:Function ):void
		{
			this.notify = notifyMethod;
		}
		
		
		private getNotifyContext():any
		{
			return this.context;
		}
			
		
		setNotifyContext( notifyContext:any ):void
		{
			this.context = notifyContext;
		}

		
		notifyObserver( notification:INotification ):void
		{
			this.getNotifyMethod().call( this.getNotifyContext(), notification );
		}
	
		
		 compareNotifyContext( object:any ):boolean
		 {
		 	return object === this.context;
		 }		
	}
