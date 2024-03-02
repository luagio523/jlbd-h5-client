import { IModel } from "../interfaces/IModel";

	
	export class Model
		implements IModel
	{
		
		proxyMap:Object = null;

		
		multitonKey:string = null;

		
		constructor( key:string )
		{
			if( Model.instanceMap[ key ] )
				throw Error( Model.MULTITON_MSG );

			Model.instanceMap[ key ] = this;
			this.multitonKey = key;
			this.proxyMap = {};	

			this.initializeModel();
		}
		
		
		initializeModel():void
		{

		}

		
		registerProxy( proxy:IProxy ):void
		{
			proxy.initializeNotifier( this.multitonKey );
			this.proxyMap[ proxy.getProxyName() ] = proxy;
			proxy.onRegister();
		}

		
		removeProxy( proxyName:string ):IProxy
		{
			var proxy:IProxy = this.proxyMap[ proxyName ];
			if( proxy )
			{
				delete this.proxyMap[ proxyName ];
				proxy.onRemove();
			}
			
			return proxy;
		}

		
		retrieveProxy( proxyName:string ):IProxy
		{
				//Return a strict null when the proxy doesn't exist
				return this.proxyMap[proxyName] || null;
		}

		
		hasProxy( proxyName:string ):boolean
		{
			return this.proxyMap[ proxyName ] != null;
		}

		
		 static MULTITON_MSG:string = "Model instance for this multiton key already constructed!";

		
		static instanceMap:Object = {};

		
		static getInstance( key ):IModel
		{
			if( !Model.instanceMap[ key ] )
				Model.instanceMap[key] = new Model( key );

			return Model.instanceMap[ key ];
		}

		
		static removeModel( key ):void
		{
			delete Model.instanceMap[ key ];
		}
	}
