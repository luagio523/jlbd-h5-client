import { _decorator, sys } from 'cc';
import * as CryptoJS from 'crypto-js';

const { ccclass } = _decorator;

type DataValue = string | number | boolean | object | null;

interface SyncData {
    [key: string]: DataValue;
}

// 验证签名
// 检查时间戳
// 检查唯一请求码是否重复 nonce
// 验证数据版本 version+1
// 游戏逻辑验证
@ccclass('DataSyncManager')
export class DataSyncManager {
    private static instance: DataSyncManager;
    private syncData: SyncData = {};
    private serverUrl: string = 'https://your-server-url.com/api';
    private privateKey: string;
    private deviceId: string;
    private version: number = 0;
    private lastSyncTime: number = 0;

    private constructor() {
        this.deviceId = "";
        this.privateKey = this.generatePrivateKey();
    }

    public static getInstance(): DataSyncManager {
        if (!DataSyncManager.instance) {
            DataSyncManager.instance = new DataSyncManager();
        }
        return DataSyncManager.instance;
    }

    private generatePrivateKey(): string {
        return CryptoJS.SHA256(this.deviceId + 'some-secret-salt').toString();
    }

    private sign(data: string): string {
        return CryptoJS.HmacSHA256(data, this.privateKey).toString();
    }

    private async send(endpoint: string, data: any): Promise<any> {
        const timestamp = Date.now();
        const nonce = CryptoJS.lib.WordArray.random(16).toString();
        const payload = JSON.stringify({
            data: data,
            timestamp: timestamp,
            nonce: nonce,
            deviceId: this.deviceId,
            version: this.version
        });
        const signature = this.sign(payload);

        const response = await fetch(`${this.serverUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature,
                'X-Device-ID': this.deviceId
            },
            body: payload
        });

        if (!response.ok) {
            throw new Error('Server request failed');
        }

        return await response.json();
    }

    public async sync(): Promise<void> {
        this.version++;
        this.lastSyncTime = Date.now();
        const response = await this.send('sync', this.syncData);
        if (!response.success) {
            throw new Error('Data sync failed: ' + response.message);
        }
        // 合并服务器返回的数据
        this.syncData = { ...this.syncData, ...response.data };
    }

    public async loadData(): Promise<void> {
        const response = await this.send('load', { deviceId: this.deviceId });
        if (response.success) {
            this.syncData = response.data;
            this.version = response.version;
            this.lastSyncTime = response.lastSyncTime;
        } else {
            throw new Error('Data load failed: ' + response.message);
        }
    }

    public setData(key: string, value: DataValue): void {
        this.syncData[key] = value;
    }

    public getData<T extends DataValue>(key: string, defaultValue: T): T {
        return (this.syncData[key] as T) ?? defaultValue;
    }

    public removeData(key: string): void {
        delete this.syncData[key];
    }

    public clearData(): void {
        this.syncData = {};
    }

    // 用于验证数据变化的方法，可以根据具体游戏逻辑来实现
    public validateDataChange(key: string, newValue: DataValue): boolean {
        // 实现具体的验证逻辑
        // 例如，检查分数增长是否合理，等级提升是否符合规则等
        return true; // 返回验证结果
    }

    public getLastSyncTime(): number {
        return this.lastSyncTime;
    }

    public getCurrentVersion(): number {
        return this.version;
    }
}