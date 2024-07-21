type Listener<T> = (data: T) => void;

class ViewModel<T extends object> {
    private _data: T;
    private _listeners: Set<Listener<T>> = new Set();
    private _observedObjects: WeakMap<object, boolean> = new WeakMap();

    constructor(data: T) {
        this._data = this.observe(data);
    }

    addListener(listener: Listener<T>): void {
        this._listeners.add(listener);
    }

    removeListener(listener: Listener<T>): void {
        this._listeners.delete(listener);
    }

    private observe(obj: any, isNested: boolean = false): any {
        if (this._observedObjects.has(obj)) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return this.observeArray(obj);
        } else if (obj !== null && typeof obj === 'object') {
            return this.observeObject(obj);
        }

        return obj;
    }

    private observeObject(obj: any): any {
        this._observedObjects.set(obj, true);

        Object.keys(obj).forEach(key => {
            let value = obj[key];
            Object.defineProperty(obj, key, {
                get: () => value,
                set: (newValue) => {
                    if (newValue !== value) {
                        value = this.observe(newValue, true);
                        this.notifyListeners();
                    }
                },
                enumerable: true,
                configurable: true
            });
            obj[key] = this.observe(value, true);
        });

        return obj;
    }

    private observeArray(arr: any[]): any[] {
        this._observedObjects.set(arr, true);

        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
            arr[method] = (...args: any[]) => {
                const result = Array.prototype[method].apply(arr, args);
                this.notifyListeners();
                return result;
            };
        });

        arr.forEach((item, index) => {
            arr[index] = this.observe(item, true);
        });

        return arr;
    }

    private notifyListeners(): void {
        this._listeners.forEach(listener => listener(this._data));
    }

    getData(): T {
        return this._data;
    }

    setData(newData: Partial<T>, silent: boolean = false): void {
        Object.assign(this._data, newData);
        if (!silent) {
            this.notifyListeners();
        }
    }
}

export class VMManager {
    private dataMap: Map<string, ViewModel<any>> = new Map();

    register<T extends object>(bindName: string, data: T): T {
        if (this.dataMap.has(bindName)) {
            throw new Error(`ViewModel with name ${bindName} already exists`);
        }
        const vm = new ViewModel<T>(data);
        this.dataMap.set(bindName, vm);
        return vm.getData();
    }

    bind<T extends object>(bindName: string, bindHandler: Listener<T>, isTrigger: boolean = false): void {
        const vm = this.getViewModel<T>(bindName);
        vm.addListener(bindHandler);
        if (isTrigger) {
            bindHandler(vm.getData());
        }
    }

    unbind<T extends object>(bindName: string, bindHandler: Listener<T>): void {
        const vm = this.getViewModel<T>(bindName);
        vm.removeListener(bindHandler);
    }

    get<T extends object>(bindName: string): T {
        return this.getViewModel<T>(bindName).getData();
    }

    set<T extends object>(bindName: string, newData: Partial<T>, silent: boolean = false): void {
        const vm = this.getViewModel<T>(bindName);
        vm.setData(newData, silent);
    }

    private getViewModel<T extends object>(bindName: string): ViewModel<T> {
        const vm = this.dataMap.get(bindName);
        if (!vm) {
            throw new Error(`No ViewModel found for ${bindName}`);
        }
        return vm as ViewModel<T>;
    }
}

// // 使用示例
// const vmMgr = new ViewModelMgr();

// // 注册并观察对象
// const user = vmMgr.register('user', { name: 'John', age: 30 });

// // 绑定监听器
// vmMgr.bind('user', (data) => {
//     console.log('User updated:', data);
// });

// // 更新数据
// user.name = 'Jane'; // 触发监听器

// // 静默更新
// vmMgr.setData('user', { age: 31 }, true);

// // 批量更新
// vmMgr.setData('user', { name: 'Alice', age: 32 });

// console.log(vmMgr.getData('user')); // { name: 'Alice', age: 32 }
