class ViewModel<T> {
    private _data: T;
    private _listeners: Set<(data: T) => void> = new Set();

    addListener(listener: (data: T) => void): void {
        this._listeners.add(listener);
    }

    removeListener(rlistener: (data: T) => void): void {
        this._listeners.delete(rlistener);
    }

    observe(data: T, isNested: boolean = false): T {
        if (!isNested) {
            this._data = data;
        }

        if (Array.isArray(data)) {
            return this.observeArray(data as unknown as any[]) as unknown as T;
        } else if (data !== null && typeof data === 'object') {
            return this.observeObject(data);
        }

        return data;
    }

    private observeObject(obj: T): T {
        const onChange = () => this._listeners.forEach(listener => { 
            console.log('changed', this._data, obj);
            listener(this._data);
        });

        const defineObservedProperty = (object: any, key: string, value: any) => {
            let observedValue = value;
            if (typeof value === 'object' && value !== null) {
                observedValue = this.observe(value, true);
            }
            Object.defineProperty(object, key, {
                get: () => observedValue,
                set: (newValue) => {
                    if (newValue !== observedValue) {
                        observedValue = this.observe(newValue, true);
                        onChange();
                    }
                },
                enumerable: true,
                configurable: true
            });
        };

        (obj as any).addProperty = function(key: string, value: any) {
            defineObservedProperty(this, key, value);
            onChange(); // 添加新属性时也触发变更
        };

        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && typeof (obj as any)[key] !== 'function') {
                defineObservedProperty(obj, key, (obj as any)[key]);
            }
        }
        return obj;
    }

    private observeArray(arr: any[]): any[] {
        const onChange = () => this._listeners.forEach(listener => listener(this._data));
        const arrayProto = Object.create(Array.prototype);

        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill'].forEach((method) => {
            arrayProto[method] = function (...args: any[]) {
                const result = Array.prototype[method].apply(this, args);
                onChange();
                return result;
            };
        });

        arrayProto.clear = function () {
            this.length = 0;
            onChange();
        };

        Object.setPrototypeOf(arr, arrayProto);

        arr.forEach((item, index) => {
            if (item !== null && typeof item === 'object') {
                arr[index] = this.observe(item, true);
            }
        });

        return arr;
    }

    public get data(): T {
        return this._data;
    }
}


/**
 * ViewModelMgr类
 * 用于管理多个ViewModel实例
 */
export class ViewModelMgr<T> {
    private dataMap: Map<string, ViewModel<T>> = new Map();

    /**
     * 注册数据
     * @param bindName 绑定名
     * @param data 要注册的数据
     * @returns 观察后的数据
     */
    public register(bindName: string, data: T): T {
        let vm = this.dataMap.get(bindName);
        if (!vm) {
            vm = this.addViewModel(bindName);
        }
        return vm.observe(data);
    }

    /**
     * 添加ViewModel
     * @param bindName 绑定名
     * @returns 新创建的ViewModel实例
     */
    private addViewModel(bindName: string): ViewModel<T> {
        const viewModel = new ViewModel<T>();
        this.dataMap.set(bindName, viewModel);
        return viewModel;
    }

    /**
     * 绑定监听器
     * @param bindName 绑定名
     * @param bindHandler 监听函数
     * @param isTrigger 是否立即触发
     */
    public bind(bindName: string, bindHandler: (data: T) => void, isTrigger: boolean = false): void {
        let vm = this.dataMap.get(bindName);
        if (!vm) {
            console.warn(`No ViewModel found for ${bindName}`);
            vm = this.addViewModel(bindName);
        }
        if (typeof bindHandler !== 'function') {
            throw new Error('Provided bindHandler is not a function');
        }
        vm.addListener(bindHandler);
        if (isTrigger && vm.data) {
            bindHandler(vm.data);
        }
    }

    /**
     * 解绑监听器
     * @param bindName 绑定名
     * @param bindHandler 要解绑的监听函数
     */
    public unbind(bindName: string, bindHandler: (data: T) => void): void {
        const vm = this.dataMap.get(bindName);
        if (vm) {
            vm.removeListener(bindHandler);
        }
    }

    /**
     * 获取数据
     * @param bindName 绑定名
     * @returns 对应的数据
     */
    public getData(bindName: string): T | undefined {
        const vm = this.dataMap.get(bindName);
        return vm ? vm.data : undefined;
    }
}






// // 测试用例
// const vmMgr = new ViewModelMgr<any>();

// // 测试对象观察
// const testObj = vmMgr.register('testObj', { name: 'John', age: 30 });
// vmMgr.bind('testObj', () => {
//     console.log('Object changed:', vmMgr.getData('testObj'));
// });

// testObj.name = 'Jane'; // 触发变更
// testObj.addProperty('gender', 'Female'); // 添加新属性

// // 测试数组观察
// const testArray = vmMgr.register('testArray', [1, 2, 3]);
// vmMgr.bind('testArray', () => {
//     console.log('Array changed:', vmMgr.getData('testArray'));
// });

// testArray.push(4); // 触发变更
// testArray.pop(); // 触发变更

// // 测试嵌套对象
// const nestedObj = vmMgr.register('nestedObj', {
//     user: { name: 'Alice', age: 25 },
//     scores: [90, 85, 92]
// });

// vmMgr.bind('nestedObj', () => {
//     console.log('Nested object changed:', vmMgr.getData('nestedObj'));
// });

// nestedObj.user.name = 'Bob'; // 触发变更
// nestedObj.scores.push(88); // 触发变更

// // 测试解绑
// const testHandler = () => console.log('Test unbind');
// vmMgr.bind('testObj', testHandler);
// vmMgr.unbind('testObj', testHandler);
// testObj.age = 31; // 不应触发testHandler

// console.log('Final testObj:', vmMgr.getData('testObj'));
// console.log('Final testArray:', vmMgr.getData('testArray'));
// console.log('Final nestedObj:', vmMgr.getData('nestedObj'));