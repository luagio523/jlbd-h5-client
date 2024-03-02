import { ICommand } from "../interfaces/ICommand";
import { IController } from "../interfaces/IController";
import { INotification } from "../interfaces/INotification";
import { IView } from "../interfaces/IView";
import { Observer } from "../patterns/observer/Observer";
import { View } from "./View";


	
	export class Controller
		implements IController
	{
				
		view:IView = null;

				
		commandMap:Object = null;

		
		multitonKey:string = null;
		
		
		constructor( key:string )
		{
			if( Controller.instanceMap[ key ] )
				throw Error( Controller.MULTITON_MSG );

			Controller.instanceMap[ key ] = this;

			this.multitonKey = key;
			this.commandMap = {};
			this.initializeController();
		}

		
		initializeController():void
		{
			this.view = View.getInstance( this.multitonKey );
		}

		
		executeCommand( notification:INotification ):void
		{
			/*
			 * Typed any here instead of <code>Function</code> ( won't compile if set to Function
			 * because today the compiler consider that <code>Function</code> is not newable and
			 * doesn't have a <code>Class</code> type)
			 */
			var commandClassRef:any = this.commandMap[ notification.getName() ];
			if( commandClassRef )
			{
				var command:ICommand = <ICommand> /*</>*/ new commandClassRef();
				command.initializeNotifier( this.multitonKey );
				command.execute( notification );
			}
		}

		
		registerCommand( notificationName:string, commandClassRef:Function ):void
		{
			if( !this.commandMap[ notificationName ] )
				this.view.registerObserver( notificationName, new Observer( this.executeCommand, this ) );

			this.commandMap[ notificationName ] = commandClassRef;
		}

		
		hasCommand( notificationName:string ):boolean
		{
			return this.commandMap[ notificationName ] != null;
		}

		
		removeCommand( notificationName:string ):void
		{
			// if the Command is registered...
			if( this.hasCommand( notificationName ) )
			{
				this.view.removeObserver( notificationName, this );			
				delete this.commandMap[notificationName];
			}
		}


		
		static MULTITON_MSG:string = "Controller instance for this multiton key already constructed!";

		
		static instanceMap:Object = {};

		
		static getInstance( key:string ):IController
		{
			if( !Controller.instanceMap[ key ] )
				Controller.instanceMap[ key ] = new Controller( key );

			return Controller.instanceMap[ key ];
		}

		
		static removeController( key:string ):void
		{
			delete Controller.instanceMap[ key ];
		}
	}
