
	
	export interface INotifier
	{
		
		sendNotification( name:string, body?:any, type?:string ):void;

		
		initializeNotifier( key:string ):void;
	}
