

export const classMap: { [key: string]: new (...args: any[]) => any } = {};

export function Effect(name: string) {
    return (ctor: new (...args: any[]) => any) => {
        Object.defineProperty(ctor, "name", {
            value: name,
            writable: false,
            enumerable: false,
            configurable: false
        });
        classMap[name] = ctor;
    };
}
