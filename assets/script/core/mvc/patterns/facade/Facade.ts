import { Controller } from "../../core/Controller";
import { Model } from "../../core/Model";
import { View } from "../../core/View";
import { IController } from "../../interfaces/IController";
import { IFacade } from "../../interfaces/IFacade";
import { IMediator } from "../../interfaces/IMediator";
import { IModel } from "../../interfaces/IModel";
import { INotification } from "../../interfaces/INotification";
import { IProxy } from "../../interfaces/IProxy";
import { IView } from "../../interfaces/IView";
import { Notification } from "../observer/Notification";


	
	export class Facade
		implements IFacade
	{
		
		model:IModel = null;

		
		view:IView = null;

		
		controller:IController = null;

		
		multitonKey:string = null;

		
		constructor( key )
		{
			if( Facade.instanceMap[ key ] )
				throw Error( Facade.MULTITON_MSG );

			this.initializeNotifier( key );
			Facade.instanceMap[ key ] = this;
			this.initializeFacade();
		}

		
		initializeFacade():void
		{
			this.initializeModel();
			this.initializeController();
			this.initializeView();
		}

		
		initializeModel():void
		{
			if( !this.model )
				this.model = Model.getInstance( this.multitonKey );
		}

		
		initializeController():void
		{
			if( !this.controller )
				this.controller = Controller.getInstance( this.multitonKey );
		}

		
		initializeView():void
		{
			if( !this.view )
				this.view = View.getInstance( this.multitonKey );
		}

		
		registerCommand( notificationName:string, commandClassRef:Function ):void
		{
			this.controller.registerCommand( notificationName, commandClassRef );
		}

		
		removeCommand( notificationName:string ):void
		{
			this.controller.removeCommand( notificationName );
		}

		
		hasCommand( notificationName:string ):boolean
		{
			return this.controller.hasCommand(notificationName);
		}

		
		registerProxy( proxy:IProxy ):void
		{
			this.model.registerProxy( proxy );
		}
				
		
		retrieveProxy( proxyName:string ):IProxy
		{
			return this.model.retrieveProxy( proxyName );
		}

		
		removeProxy ( proxyName:string ):IProxy
		{
			var proxy:IProxy;
			if( this.model )
				proxy = this.model.removeProxy( proxyName );

			return proxy
		}

		
		hasProxy( proxyName:string ):boolean
		{
			return this.model.hasProxy( proxyName );
		}

		
		registerMediator( mediator:IMediator ):void
		{
			if( this.view )
				this.view.registerMediator( mediator );
		}

		
		retrieveMediator( mediatorName:string ):IMediator
		{
			return this.view.retrieveMediator( mediatorName );
		}

		
		removeMediator( mediatorName:string ):IMediator
		{
			var mediator:IMediator;
			if( this.view )
				mediator = this.view.removeMediator( mediatorName );

			return mediator;
		}

		
		hasMediator( mediatorName:string ):boolean
		{
			return this.view.hasMediator( mediatorName );
		}

		
		notifyObservers ( notification:INotification ):void
		{
			if( this.view )
				this.view.notifyObservers( notification );
		}

		
		sendNotification( name:string, body:any=null, type:string=null ):void
		{
			this.notifyObservers( new Notification( name, body, type ) );
		}
		
		
		initializeNotifier( key:string ):void
		{
			this.multitonKey = key;
		}

		
		static MULTITON_MSG:string = "Facade instance for this multiton key already constructed!";

		
		static instanceMap:Object = {};

		
		static getInstance( key:string ):IFacade
		{
			if( !Facade.instanceMap[ key ] )
				Facade.instanceMap[ key ] = new Facade( key );

			return Facade.instanceMap[ key ];
		}

		
		static hasCore( key:string ):boolean
		{
			return Facade.instanceMap[ key ] ? true : false;
		}

		
		static removeCore( key:string ):void
		{
			if( !Facade.instanceMap[ key ] )
				return;

			Model.removeModel( key ); 
			View.removeView( key );
			Controller.removeController( key );

			delete Facade.instanceMap[ key ];
		}
	}
