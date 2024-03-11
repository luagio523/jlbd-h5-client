
class ViewModel<T> {
    private _data: T;
    private _listeners: Array<Function> = [];

    constructor() {
        
    }

    addListener(listener: Function) {
        this._listeners.push(listener);
    }

    removeListener(rlistener: Function) {
        this._listeners = this._listeners.filter(listener => listener !== rlistener);
    }

    observe(data: T): any {
        if (Array.isArray(data)) {
            return this.observeArray(data);
        } else if (data !== null && typeof data === 'object') {
            return this.observeObject(data);
        }
        this._data = data 
        return data;
    }

    observeObject(obj: any) {
        const onChange = () => this._listeners.forEach(listener => listener());
        const defineObservedProperty = (object, key, value) => {
            Object.defineProperty(object, key, {
                get: () => value,
                set: (newValue) => {
                    if (newValue !== value) {
                        value = newValue;
                        onChange()
                    }
                },
                enumerable: true,
                configurable: true
            });
        }

        obj.addProperty = function(key, value) {
            defineObservedProperty(this, key, value);
        };

        for (let key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] !== 'function') {
                defineObservedProperty(obj, key, obj[key]);
            }
        }
        return obj;
    }

    observeArray(arr:Array<any>) {
        if (!Array.isArray(arr)) {
            throw new Error('Expected an array');
        }
        const onChange = () => this._listeners.forEach(listener => listener());
        var arrayProto = Object.create(Array.prototype);

        arrayProto.fill = function (...items) {
            this.length = 0;
            this.push(...items);
        };
        arrayProto.clear = function (...items) {
            this.length = 0;
            onChange()
        };
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
            arrayProto[method] = function () {
                var oldLength = this.length;
                Array.prototype[method].apply(this, arguments);
                if (this.length !== oldLength) {
                    console.log('Array length changed from ' + oldLength + ' to ' + this.length);
                    onChange()
                }
            };
        });

        var observedArray = arr;
        observedArray['__proto__'] = arrayProto;

        let self = this
        observedArray.forEach((item, index) => {
            if (item !== null && typeof item === 'object') {
                observedArray[index] = self.observe(item);
            }
        });

        return observedArray;
    }


    public get data():T{
        return this._data
    }
}


export class ViewModelMgr<T>  {
    private dataMap: { [bindName: string]: ViewModel<T> };
    public register(bindName: string, arr: T) {
        let vm = this.dataMap[bindName]
        if (!vm) {
            vm = this.addViewModel(bindName)
        }
        return vm.observe(arr) // 允许先绑定吧
    }

    private addViewModel(bindName: string): ViewModel<T> {
        const viewModel = new ViewModel<T>();
        this.dataMap[bindName] = viewModel;
        return viewModel;
    }

    /**
     * 
     * @param bindName 绑定的唯一名
     * @param bindHandler 绑定的处理函数
     * @param isTrigger 是否直接触发
     * @returns 
     */
    public bind(bindName: string, bindHandler: Function,isTrigger?:boolean) {
        let vm = this.dataMap[bindName]
        if (!vm) {
            vm = this.addViewModel(bindName)
        }
        if(typeof bindHandler !== 'function' ) {
            throw new Error('Provided bindHandler is not a function or is null');
        }
        vm.addListener(bindHandler)
        if(isTrigger??false){
            if(vm.data){
                bindHandler(vm.data)
            }
        }
    }

    public unbind(bindName: string, bindHandler: Function) {
        const vm = this.dataMap[bindName]
        if (!vm) {
            return
        }
        vm.removeListener(bindHandler)
    }
}