import { Component, debug, js, log } from "cc";
import { mvc } from "./__private";



function isFunction(value: unknown): value is Function {
    return typeof value === 'function';
}

function validateEventName(eventName: string): void {
    if (typeof eventName !== 'string' || eventName.trim() === '') {
        throw new Error('Event name must be a non-empty string');
    }
}

class Observer {
    private action: IActionHandler;
    private context: any;
    public name: string;

    constructor(name: string, action: IActionHandler) {
        this.name = name;
        this.action = action;
    }

    setContext(context: any): void {
        this.context = context;
    }

    notifyObserver(...args: any): void {
        if (isFunction(this.action)) {
            this.action.apply(this.context, args);
        }
    }

    compareNotifyContext(object: any): boolean {
        return object === this.context;
    }
}

export class Facade {
    private static _instance: Facade;
    private _observerMap: { [eventName: string]: Observer[] };
    private _actorMap: { [module: string]: Actor };
    private _mediatorMap: { [mediator: string]: Mediator };
    private _proxyMap: { [proxy: string]: Proxy };
    private _skippedActors: { [module: string]: { m: any, s: any } };

    private constructor() {
        this._observerMap = {};
        this._actorMap = {};
        this._skippedActors = {};
        this._mediatorMap = {};
        this._proxyMap = {};
    }

    static getInstance(): Facade {
        if (!Facade._instance) {
            Facade._instance = new Facade();
        }
        return Facade._instance;
    }

    skip(modules: { [module: string]: [any, any] }): void {
        for (const module in modules) {
            const [m, s] = modules[module];
            this._skippedActors[module] = { m, s };
        }
    }

    retrieveProxy(proxyName: string): Proxy {
        let proxy = this._proxyMap[proxyName];
        if (!proxy) {
            proxy = this.loadProxy(proxyName);
            this._proxyMap[proxyName] = proxy;
            proxy.onRegister();
        }
        return proxy;
    }

    retrieveMediator(mediatorName: string): Mediator {
        const mediator = this._mediatorMap[mediatorName];
        if (!mediator) {
            throw new Error(`Mediator is not registered: ${mediatorName}`);
        }
        return mediator;
    }

    registerMediator(mediatorName: string): Mediator {
        if (this._mediatorMap[mediatorName]) {
            return this._mediatorMap[mediatorName];
        }
        const mediator = this.loadMediator(mediatorName);
        this._mediatorMap[mediatorName] = mediator;
        const interests = mediator.listInterests();
        interests.forEach(([eventName, action]) => {
            validateEventName(eventName);
            if (!isFunction(action)) {
                throw new Error(`Action is not a function for event: ${eventName}`);
            }
            const observer = new Observer(eventName, action);
            observer.setContext(mediator);
            this.registerObserver(eventName, observer);
        });
        mediator.onRegister();
        return mediator;
    }

    removeProxy(proxyName: string): void {
        const proxy = this._proxyMap[proxyName];
        if (proxy) {
            delete this._proxyMap[proxyName];
            proxy.onRemove();
        }
    }

    removeMediator(mediatorName: string): void {
        const mediator = this._mediatorMap[mediatorName];
        if (mediator) {
            delete this._mediatorMap[mediatorName];
            mediator.onRemove();
        }
    }

    registerObserver(eventName: string, observer: Observer): void {
        validateEventName(eventName);
        this._observerMap[eventName] = this._observerMap[eventName] ?? [];
        this._observerMap[eventName].push(observer);
    }

    notifyObservers(eventName: string, ...args: any[]): void {
        validateEventName(eventName);
        const observers = this._observerMap[eventName];
        // console.log(js.formatStr("Notifying observers for eventName: [%s]", eventName),this._observerMap);

        if (observers) {
            observers.forEach((observer) => observer.notifyObserver(...args));
        } else {
            log(js.formatStr("Cannot find observers for eventName: [%s]", eventName));
        }
    }

    send(eventName: string, ...args: any): void {
        debug(`Facade.send: ${eventName}`, args);
        this.notifyObservers(eventName, ...args);
    }

    registerModules(modules: string[]): void {
        modules.forEach(module => this.registerActor(module));
    }

    registerActor(moduleName: string): void {
        if (!moduleName) {
            throw new Error("Module name is empty");
        }
        if (this._actorMap[moduleName]) {
            throw new Error(`Module name [${moduleName}] has already been registered`);
        }
        const actor = this.loadActor(moduleName);
        if (!actor) {
            throw new Error(`[${moduleName}]Actor cannot be loaded, please check class definition`);
        }
        this._actorMap[moduleName] = actor;
        actor.onRegister();
        const interests = actor.listInterests();
        interests.forEach(([eventName, action]) => {
            validateEventName(eventName);
            if (!isFunction(action)) {
                throw new Error(`Action is not a function for event: ${eventName}`);
            }
            const observer = new Observer(moduleName, action);
            observer.setContext(actor);
            this.registerObserver(eventName, observer);
        });
    }

    private loadActor(module: string, controller?: string): Actor {
        const controller_ = controller || module;
        const className = `${controller_}Actor`;
        const ClassDef = mvc.getClass<typeof Actor>(className);
        if (!ClassDef) {
            throw new Error(`Cannot find class: [${className}]`);
        }
        return new ClassDef(module);
    }

    private loadProxy(proxy: string): Proxy {
        const className = proxy;
        const ClassDef = mvc.getClass<typeof Proxy>(className);
        if (!ClassDef) {
            throw new Error(`Cannot find class: [${className}]`);
        }
        return new ClassDef();
    }

    private loadMediator(view: string): Mediator {
        const className = view;
        const ClassDef = mvc.getClass<typeof Mediator>(className);
        if (!ClassDef) {
            throw new Error(`Cannot find class: [${className}]`);
        }
        return new ClassDef();
    }
}

export class Notifier {
    send(name: string, ...args: any): void {
        Facade.getInstance().send(name, ...args);
    }
}

export interface IActionHandler {
    (...args: any): void;
}

export class Actor extends Notifier {
    protected moduleName: string;

    constructor(name: string) {
        super();
        this.moduleName = name;
    }

    onRegister(): void { }

    onRemove(): void { }

    addListener(eventName: string, action: IActionHandler): void {
        validateEventName(eventName);
        if (!isFunction(action)) {
            throw new Error(`Action is not a function for event: ${eventName}`);
        }
        const observer = new Observer(eventName, action);
        observer.setContext(this);
        Facade.getInstance().registerObserver(eventName, observer);
    }

    listInterests(): [string, IActionHandler][] {
        return [];
    }
}

export class Event extends Component { }

export class Mediator extends Notifier {
    protected mediatorName: string;
    protected viewComponent: any;

    onRegister(): void { }

    onRemove(): void { }

    listInterests(): [string, IActionHandler][] {
        return [];
    }

    getMediatorName(): string {
        return this.mediatorName;
    }
}

export class Proxy extends Notifier {
    get name(): string {
        return this.constructor.name;
    }

    onRegister(): void { }

    onRemove(): void { }

    constructor() {
        super();
    }
}
