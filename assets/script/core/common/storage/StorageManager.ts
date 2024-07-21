

import { _decorator, sys } from 'cc';

const { ccclass } = _decorator;

@ccclass('StorageManager')
export class StorageManager {
    private static instance: StorageManager;

    public static getInstance(): StorageManager {
        if (!StorageManager.instance) {
            StorageManager.instance = new StorageManager();
        }
        return StorageManager.instance;
    }

    private constructor() {}

    public setItem(key: string, value: any, encryptFn?: (data: string) => string): void {
        let dataToStore = JSON.stringify(value);
        if (encryptFn) {
            dataToStore = encryptFn(dataToStore);
        }
        sys.localStorage.setItem(key, dataToStore);
    }

    public getItem<T>(key: string, decryptFn?: (data: string) => string): T | null {
        const storedData = sys.localStorage.getItem(key);
        if (storedData) {
            let parsedData: string;
            if (decryptFn) {
                try {
                    parsedData = decryptFn(storedData);
                } catch (error) {
                    console.error('Decryption failed:', error);
                    return null;
                }
            } else {
                parsedData = storedData;
            }

            try {
                return JSON.parse(parsedData) as T;
            } catch (error) {
                console.error('Parsing failed:', error);
                return null;
            }
        }
        return null;
    }

    public removeItem(key: string): void {
        sys.localStorage.removeItem(key);
    }

    public clear(): void {
        sys.localStorage.clear();
    }
}




// const storage = StorageManager.getInstance();

// 存储 boolean 类型
// storage.setItem('isLoggedIn', true);

// // 存储 User 类型
// const user: User = {
//     id: 1,
//     name: 'John Doe',
//     email: 'john@example.com'
// };
// storage.setItem('currentUser', user);

// // 存储 number 类型
// storage.setItem('lastLoginTimestamp', Date.now());

// // 获取 boolean 类型
// const isLoggedIn = storage.getItem<boolean>('isLoggedIn');
// console.log('Is logged in:', isLoggedIn);

// // 获取 User 类型
// const currentUser = storage.getItem<User>('currentUser');
// if (currentUser) {
//     console.log('Current user:', currentUser.name);
// }

// // 获取 number 类型
// const lastLoginTimestamp = storage.getItem<number>('lastLoginTimestamp');
// if (lastLoginTimestamp) {
//     console.log('Last login:', new Date(lastLoginTimestamp).toLocaleString());
// }