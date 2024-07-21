
import  CryptoJS from 'crypto-js';


export class CryptoUtils {
    public static aesEncrypt(data: string, key: string): string {
        const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
        return encryptedData;
    }

    public static aesDecrypt(encrypted: string, key: string): string {
        const bytes = CryptoJS.AES.decrypt(encrypted, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    public static sha256(data: string): string {
        const hash = CryptoJS.SHA256(data).toString();
        return hash;
    }

    //Base64编码
    public static base64Encode(data: string): string {
        const encodedData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
        return encodedData;
    }
    // 解析Base64编码
    public static base64Decode(encodedData: string): string {
        const decodedData = CryptoJS.enc.Base64.parse(encodedData).toString(CryptoJS.enc.Utf8);
        return decodedData;
    }
    

}

