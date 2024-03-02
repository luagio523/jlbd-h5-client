import { INotification } from "../../interfaces/INotification";

	
	export class Notification
		implements INotification
	{
		
		private name:string = null;

		
		private body:any = null;

		
		private type:string = null;

		
		constructor( name:string, body:any=null, type:string=null )
		{
			this.name = name;
			this.body = body;
			this.type = type;
		}

		
		getName():string
		{
			return this.name;
		}

		
		setBody( body:any ):void
		{
			this.body = body;
		}

		
		getBody():any
		{
			return this.body;
		}

		
		setType( type:string ):void
		{
			this.type = type;
		}

		
		getType():string
		{
			return this.type;
		}

		
		toString():string
		{
			var msg:string = "Notification Name: " + this.getName();
			msg += "\nBody:" + (( this.getBody() == null ) ? "null" : this.getBody().toString());
			msg += "\nType:" + (( this.getType() == null ) ? "null" : this.getType());
			return msg;
		}		
	}
