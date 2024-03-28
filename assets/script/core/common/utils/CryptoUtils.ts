

export class CryptoUtils {
    public static aesEncrypt(data: string, key: string): string {
        let encrypted = "";
        for (let i = 0; i < data.length; i++) {
            let char = data.charCodeAt(i);
            // 处理小写字母
            if (char >= 97 && char <= 122) {
                encrypted += String.fromCharCode((char - 97 + parseInt(key)) % 26 + 97);
            } 
            // 处理大写字母
            else if (char >= 65 && char <= 90) {
                encrypted += String.fromCharCode((char - 65 + parseInt(key)) % 26 + 65);
            } 
            else {
                encrypted += data.charAt(i);
            }
        }
        return encrypted;
    }

    public static aesDecrypt(encrypted: string, key: string): string {
        let decrypted = "";
        for (let i = 0; i < encrypted.length; i++) {
            let char = encrypted.charCodeAt(i);
            if (char >= 97 && char <= 122) {
                decrypted += String.fromCharCode((char - 97 - parseInt(key) + 26) % 26 + 97);
            } 
            else if (char >= 65 && char <= 90) {
                decrypted += String.fromCharCode((char - 65 - parseInt(key) + 26) % 26 + 65);
            }  
            else {
                decrypted += encrypted.charAt(i);
            }
        }
        return decrypted;
    }
}

// import CryptoES from 'crypto-ts'

// /**
//  * 不能说的秘密
//  */
// export class CryptoUtils{
//     public static  aesEncrypt(data:string, key:string):string {

//         // const key = CryptoES.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
//         // const iv = CryptoES.enc.Hex.parse('101112131415161718191a1b1c1d1e1f');
//         // const encrypted = CryptoES.AES.encrypt("Message", key, { iv: iv });

//         const encrypted = CryptoES.AES.encrypt(data, key);
//         return encrypted.toString();
//     }
//     public static  aesDecrypt(encrypted:string, key:string):string {
//         const decrypted = CryptoES.AES.decrypt(encrypted, key)
//         return decrypted.toString(CryptoES.enc.Utf8);;
//     }
    
// }

// static async aesEncrypt(plainText: string, password: string): Promise<string> {
//     const ptUtf8 = new TextEncoder().encode(plainText)
//     const pwUtf8 = new TextEncoder().encode(password)
//     const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8)
    
//     const iv = crypto.getRandomValues(new Uint8Array(12))
//     const alg = { name: 'AES-GCM', iv: iv }

//     const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt'])
//     const encBuffer = await crypto.subtle.encrypt(alg, key, ptUtf8)

//     const encArray = new Uint8Array(encBuffer)
//     const encIvArray = new Uint8Array(12 + encArray.length)

//     encIvArray.set(iv)
//     encIvArray.set(encArray, iv.length)

//     return btoa(String.fromCharCode(...encIvArray))
// }

// static async aesDecrypt(cipherText: string, password: string): Promise<string> {
//     const ctArray = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0))

//     const iv = ctArray.slice(0, 12)
//     const ct = ctArray.slice(12)

//     const pwUtf8 = new TextEncoder().encode(password)
//     const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8)
//     const alg = { name: 'AES-GCM', iv: iv }

//     const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt'])
//     const ptBuffer = await crypto.subtle.decrypt(alg, key, ct)

//     return new TextDecoder().decode(ptBuffer)
// }

// CryptoUtils.aesEncrypt('Hello World', 'password')
//     .then(encrypted => {
//         console.log('Encrypted Text:', encrypted)
//         return CryptoUtils.aesDecrypt(encrypted, 'password')
//     })
//     .then(plainText => {
//         console.log('Decrypted Text:', plainText)
//     })



// var data = 'Hello, this is a secret message!';
// var key = 'Password!';
// var encrypted = aesEncrypt(data, key);
// var decrypted = aesDecrypt(encrypted, key);

// cc.log('Plain text: ' + data);
// cc.log('Encrypted text: ' + encrypted);
// cc.log('Decrypted text: ' + decrypted);