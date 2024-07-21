import { CryptoUtils } from "../utils/CryptoUtils";


export enum SecureOptions {
    None = 0,
    UseAES = 1 << 0,
    UseHash = 1 << 1,
    UseTimestamp = 1 << 2,
    UseBase64 = 1 << 3
}

export class SecureManager {
    private baseEncryptionKey: string; // 基础加密密钥 可能是密钥+salt(uid)

    private static instance: SecureManager;

    public static getInstance(): SecureManager {
        if (!SecureManager.instance) {
            SecureManager.instance = new SecureManager();
        }
        return SecureManager.instance;
    }
    

    public initialize(baseEncryptionKey: string): void {
        this.baseEncryptionKey = baseEncryptionKey;
    }

    private generateKey(timestamp: number): string {
        return CryptoUtils.sha256(this.baseEncryptionKey + timestamp.toString());
    }

    public process(data: string, options: SecureOptions = SecureOptions.None): string {
        if(!this.baseEncryptionKey) {
            console.warn('SecureManager baseEncryptionKey is not initialized.');
        }

        let processedData = data;
        let timestamp = '';
        let hash = '';

        if (options & SecureOptions.UseTimestamp) {
            timestamp = new Date().getTime().toString();
        }

        if (options & SecureOptions.UseAES) {
            const key = (options & SecureOptions.UseTimestamp) ? this.generateKey(Number(timestamp)) : this.baseEncryptionKey;
            processedData = CryptoUtils.aesEncrypt(processedData, key);
        }

        if (options & SecureOptions.UseHash) {
            hash = this.generateHash(data);
        }

        let result = [timestamp, processedData, hash].filter(Boolean).join(':');

        if (options & SecureOptions.UseBase64) {
            result = CryptoUtils.base64Encode(result);
        }

        return result;
    }

    public unprocess(data: string, options: SecureOptions = SecureOptions.None): string | null {
        if(!this.baseEncryptionKey) {
            console.warn('SecureManager baseEncryptionKey is not initialized.');
        }
        try {
            let processedData = data;

            if (options & SecureOptions.UseBase64) {
                processedData = CryptoUtils.base64Decode(processedData);
            }

            const parts = processedData.split(':');
            let timestamp = '', encryptedData = '', hash = '';

            if ((options & SecureOptions.UseTimestamp) && (options & SecureOptions.UseHash)) {
                [timestamp, encryptedData, hash] = parts;
            } else if (options & SecureOptions.UseTimestamp) {
                [timestamp, encryptedData] = parts;
            } else if (options & SecureOptions.UseHash) {
                [encryptedData, hash] = parts;
            } else {
                encryptedData = parts[0];
            }

            if (options & SecureOptions.UseAES) {
                const key = (options & SecureOptions.UseTimestamp) ? this.generateKey(Number(timestamp)) : this.baseEncryptionKey;
                encryptedData = CryptoUtils.aesDecrypt(encryptedData, key);
            }

            if ((options & SecureOptions.UseHash) && !this.verifyIntegrity(encryptedData, hash)) {
                console.error('Data integrity check failed.');
                return null;
            }

            return encryptedData;
        } catch (error) {
            console.error('Unprocessing failed:', error);
            return null;
        }
    }

    public generateHash(data: string): string {
        return CryptoUtils.sha256(data);
    }

    public verifyIntegrity(data: string, hash: string): boolean {
        return this.generateHash(data) === hash;
    }
}



// const secureManager = new SecureManager('your-secret-key');

// // 使用所有安全特性
// const fullSecureData = secureManager.process('Sensitive information', 
//     SecureOptions.UseAES | SecureOptions.UseHash | SecureOptions.UseTimestamp | SecureOptions.UseBase64);
// console.log('Full secure:', fullSecureData);

// // 只使用 AES 加密和 Base64 编码
// const simpleSecureData = secureManager.process('Sensitive information', 
//     SecureOptions.UseAES | SecureOptions.UseBase64);
// console.log('Simple secure:', simpleSecureData);

// // 解密完全安全的数据
// const decryptedFull = secureManager.unprocess(fullSecureData, 
//     SecureOptions.UseAES | SecureOptions.UseHash | SecureOptions.UseTimestamp | SecureOptions.UseBase64);
// console.log('Decrypted full:', decryptedFull);

// // 解密简单安全的数据
// const decryptedSimple = secureManager.unprocess(simpleSecureData, 
//     SecureOptions.UseAES | SecureOptions.UseBase64);
// console.log('Decrypted simple:', decryptedSimple);