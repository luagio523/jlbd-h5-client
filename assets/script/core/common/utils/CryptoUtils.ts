import * as crypto from 'crypto'

/**
 * 不能说的秘密
 */
export class CryptoUtils{
    public static  aesEncrypt(data, key) {
        const cipher = crypto.createCipher('aes192', key);
        var crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }
    
    public static  aesDecrypt(encrypted, key) {
        const decipher = crypto.createDecipher('aes192', key);
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}



// var data = 'Hello, this is a secret message!';
// var key = 'Password!';
// var encrypted = aesEncrypt(data, key);
// var decrypted = aesDecrypt(encrypted, key);

// cc.log('Plain text: ' + data);
// cc.log('Encrypted text: ' + encrypted);
// cc.log('Decrypted text: ' + decrypted);