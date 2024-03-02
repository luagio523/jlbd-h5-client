import { IMediator } from "../interfaces/IMediator";
import { INotification } from "../interfaces/INotification";
import { IObserver } from "../interfaces/IObserver";
import { IView } from "../interfaces/IView";
import { Observer } from "../patterns/observer/Observer";


export class View
	implements IView {
	
	mediatorMap: Object = null;

	
	observerMap: Object = null;

	
	multitonKey: string = null;

	
	constructor(key: string) {
		if (View.instanceMap[key])
			throw Error(View.MULTITON_MSG);

		View.instanceMap[key] = this;

		this.multitonKey = key;
		this.mediatorMap = {};
		this.observerMap = {};

		this.initializeView();
	}

	
	initializeView(): void {

	}

	
	registerObserver(notificationName: string, observer: IObserver): void {
		var observers: IObserver[] = this.observerMap[notificationName];
		if (observers)
			observers.push(observer);
		else
			this.observerMap[notificationName] = [observer];
	}

	
	removeObserver(notificationName: string, notifyContext: any): void {
		//The observer list for the notification under inspection
		var observers: IObserver[] = this.observerMap[notificationName];

		//Find the observer for the notifyContext.
		var i: number = observers.length;
		while (i--) {
			var observer: IObserver = observers[i];
			if (observer.compareNotifyContext(notifyContext)) {
				observers.splice(i, 1);
				break;
			}
		}

		/*
		 * Also, when a Notification's Observer list length falls to zero, delete the
		 * notification key from the observer map.
		 */
		if (observers.length == 0)
			delete this.observerMap[notificationName];
	}

	
	notifyObservers(notification: INotification): void {
		var notificationName: string = notification.getName();

		var observersRef/*Array*/ = this.observerMap[notificationName];
		if (observersRef) {
			// Copy the array.
			var observers/*Array*/ = observersRef.slice(0);
			var len/*Number*/ = observers.length;
			for (var i/*Number*/ = 0; i < len; i++) {
				var observer/*Observer*/ = observers[i];
				observer.notifyObserver(notification);
			}
		}
	}

	
	registerMediator(mediator: IMediator): void {
		var name: string = mediator.getMediatorName();

		//Do not allow re-registration (you must removeMediator first).
		if (this.mediatorMap[name])
			return;

		mediator.initializeNotifier(this.multitonKey);

		//Register the Mediator for retrieval by name.
		this.mediatorMap[name] = mediator;

		//Get Notification interests, if any.
		var interests: string[] = mediator.listNotificationInterests();
		var len: number = interests.length;
		if (len > 0) {
			//Create Observer referencing this mediator's handlNotification method.
			var observer: IObserver = new Observer(mediator.handleNotification, mediator);

			//Register Mediator as Observer for its list of Notification interests.
			for (var i: number = 0; i < len; i++)
				this.registerObserver(interests[i], observer);
		}

		//Alert the mediator that it has been registered.
		mediator.onRegister();
	}

	
	retrieveMediator(mediatorName: string): IMediator {
		//Return a strict null when the mediator doesn't exist
		return this.mediatorMap[mediatorName] || null;
	}

	
	removeMediator(mediatorName: string): IMediator {
		// Retrieve the named mediator
		var mediator: IMediator = this.mediatorMap[mediatorName];
		if (!mediator)
			return null;

		//Get Notification interests, if any.
		var interests: string[] = mediator.listNotificationInterests();

		//For every notification this mediator is interested in...
		var i: number = interests.length;
		while (i--)
			this.removeObserver(interests[i], mediator);

		// remove the mediator from the map
		delete this.mediatorMap[mediatorName];

		//Alert the mediator that it has been removed
		mediator.onRemove();

		return mediator;
	}

	
	hasMediator(mediatorName: string): boolean {
		return this.mediatorMap[mediatorName] != null;
	}


	
	static MULTITON_MSG: string = "View instance for this multiton key already constructed!";

	
	static instanceMap: Object = {};

	
	static getInstance(key: string): IView {
		if (!View.instanceMap[key])
			View.instanceMap[key] = new View(key);

		return View.instanceMap[key];
	}

	
	static removeView(key: string): void {
		delete View.instanceMap[key];
	}
}
