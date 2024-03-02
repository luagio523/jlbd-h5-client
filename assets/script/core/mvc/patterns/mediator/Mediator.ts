
import { IMediator } from "../../interfaces/IMediator";
import { INotification } from "../../interfaces/INotification";
import { INotifier } from "../../interfaces/INotifier";
import { Notifier } from "../observer/Notifier";

	
	export class Mediator
		extends Notifier
		implements IMediator, INotifier
	{
		
		mediatorName:string = null;

		
		viewComponent:any = null;

		
		constructor( mediatorName:string=null, viewComponent:any=null )
		{
			super();

			this.mediatorName = (mediatorName != null) ? mediatorName : Mediator.NAME;
			this.viewComponent = viewComponent;	
		}

				
		getMediatorName():string
		{	
			return this.mediatorName;
		}

		
		getViewComponent():any
		{	
			return this.viewComponent;
		}

		
		setViewComponent( viewComponent:any ):void
		{
			this.viewComponent = viewComponent;
		}

		
		listNotificationInterests():string[]
		{
			return new Array<string>();
		}

		 
		handleNotification( notification:INotification ):void
		{

		}

		 
		onRegister():void
		{

		}

		 
		onRemove():void
		{

		}

		
		static NAME:string = 'Mediator';
	}
