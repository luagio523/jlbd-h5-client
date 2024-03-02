import { INotification } from "./INotification";
import { INotifier } from "./INotifier";

	
	export interface IMediator
		extends INotifier
	{
		
		getMediatorName():string;
		
		
		getViewComponent():any;

		
		setViewComponent( viewComponent:any ):void;
		
		
		listNotificationInterests( ):string[];
		
		 
		handleNotification( notification:INotification ):void;
		
		 
		onRegister():void;

		 
		onRemove():void;
	}
