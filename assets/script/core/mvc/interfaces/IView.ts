import { IMediator } from "./IMediator";
import { INotification } from "./INotification";
import { IObserver } from "./IObserver";

export interface IView {

	registerObserver(notificationName: string, observer: IObserver): void;

	removeObserver(notificationName: string, notifyContext: any): void;

	notifyObservers(notification: INotification): void;

	registerMediator(mediator: IMediator): void;

	retrieveMediator(mediatorName: string): IMediator;

	removeMediator(mediatorName: string): IMediator;

	hasMediator(mediatorName: string): boolean;
}
