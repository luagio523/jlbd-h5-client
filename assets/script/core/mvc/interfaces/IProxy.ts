import { INotifier } from "./INotifier";

export interface IProxy
	extends INotifier {

	getProxyName(): string;

	setData(data: any): void;

	getData(): any;

	onRegister(): void;

	onRemove(): void;
}
