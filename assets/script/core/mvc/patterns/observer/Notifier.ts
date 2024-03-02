
	"use strict";

import { IFacade } from "../../interfaces/IFacade";
import { INotifier } from "../../interfaces/INotifier";
import { Facade } from "../facade/Facade";

	
	export class Notifier
		implements INotifier
	{
		
		multitonKey:string = null;

		
		 initializeNotifier( key )
		{
			this.multitonKey = key;
		}

		
		sendNotification( name:string, body:any=null, type:string=null ):void
		{
			if( this.facade() ) 
				this.facade().sendNotification( name, body, type );
		}

		
		facade():IFacade
		{
			if( this.multitonKey === null )
					throw Error( Notifier.MULTITON_MSG );

			return Facade.getInstance( this.multitonKey );
		}

		
		static MULTITON_MSG:string = "multitonKey for this Notifier not yet initialized!";
	}
