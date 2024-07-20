// 类型定义
type Constructor<T = any> = new (...args: any[]) => T;

// 类映射
const classMap: { [className: string]: any } = {};

// mvc 命名空间
export namespace mvc {
    // class 装饰器
    export function component(name: string) {
        return function<T extends Constructor>(target: T) {
            // 注册类
            classMap[name] = target;
            
            // 设置类的 name 属性
            Object.defineProperty(target, "name", {
                value: name,
                writable: false,
            });

            // 使用类型断言返回原始类
            return target as T & { [key: string]: any };
        }
    }

    // 通过名称获取类
    export function getClass<T>(name: string): T {
        return classMap[name] as T;
    }
}
