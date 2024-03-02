import { IProxy } from "./IProxy";

	
	export interface IModel
	{
		
		registerProxy( proxy:IProxy ):void;

		
		removeProxy( proxyName:string ):IProxy;

		
		retrieveProxy( proxyName:string ):IProxy;

		
		hasProxy( proxyName:string ):boolean;
	}
