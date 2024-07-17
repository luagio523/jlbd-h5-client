import { _decorator, Component, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LocationManager')
export class LocationManager extends Component {
    private static instance: LocationManager | null = null;

    public static getInstance(): LocationManager {
        if (!LocationManager.instance) {
            LocationManager.instance = new LocationManager();
        }
        return LocationManager.instance;
    }

    /**
     * 获取参数值
     * @param key 参数键
     * @param defaultValue 默认值（可选）
     * @returns 参数值或默认值
     */
    public getParam(key: string, defaultValue: string = ''): string {
        // 1. 从全局对象读取
        if (typeof globalThis !== 'undefined' && globalThis[key] !== undefined) {
            return String(globalThis[key]);
        }

        // 2. 从本地存储读取
        const localValue = this.getFromLocalStorage(key);
        if (localValue !== null) {
            return localValue;
        }

        // 3. 从 URL 路径解析读取
        const urlValue = this.getFromUrlPath(key);
        if (urlValue !== null) {
            return urlValue;
        }

        // 如果都没有找到，返回默认值
        return defaultValue;
    }

    private getFromLocalStorage(key: string): string | null {
        return sys.localStorage.getItem(key);
    }

    private getFromUrlPath(key: string): string | null {
        if (sys.isBrowser) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(key);
        }
        return null;
    }

    /**
     * 设置参数值（同时设置到全局对象和本地存储）
     * @param key 参数键
     * @param value 参数值
     */
    public setParam(key: string, value: string): void {
        if (typeof globalThis !== 'undefined') {
            globalThis[key] = value;
        }
        sys.localStorage.setItem(key, value);
    }

    /**
     * 清除参数（从全局对象和本地存储中删除）
     * @param key 参数键
     */
    public clearParam(key: string): void {
        if (typeof globalThis !== 'undefined') {
            delete globalThis[key];
        }
        sys.localStorage.removeItem(key);
    }
}