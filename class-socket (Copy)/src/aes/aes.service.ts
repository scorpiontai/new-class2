import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AesService {
    private readonly key: CryptoJS.lib.WordArray;
    private readonly iv: CryptoJS.lib.WordArray;

    constructor() {
        const keyEnv = process.env.CRYPTO_KEY || 'TK7sJYEMWT7NVVt88XatqKTn3o176TVq7a/c1wp88Idbreythd0ANUPI3Lttx+s7';
        const ivEnv = process.env.CRYPTO_IV || 'x2/8Ag/IfEgrGsdHB4S6wQz+K6aSv2wmNMoV1bMBAlQ=';

        this.key = CryptoJS.enc.Base64.parse(keyEnv);
        this.iv = CryptoJS.enc.Base64.parse(ivEnv);
    }

    // Fungsi untuk mengenkripsi teks
    async encrypt(text: any): Promise<any> {
        try {
            const encrypted = CryptoJS.AES.encrypt(text, this.key, {
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });

            return encrypted.toString();
        } catch (err) {
            console.error(err.message);
        }
    }

    decrypt(encryptedText: any): any {
        const decrypted = CryptoJS.AES.decrypt(encryptedText, this.key, {
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
    
        return decrypted.toString(CryptoJS.enc.Utf8);
      }

      
    async encryptMedia(buffer: Buffer): Promise<any> {
        try {

            const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Hex.parse(buffer.toString('hex')), this.key, {
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });


            return encrypted.toString();
        } catch (err) {
            console.error('Error encrypting media:', err.message);
            throw err;
        }
    }
    async decryptMedia(encryptedData: string): Promise<any> {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key, {
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });

            const decryptedHex = decrypted.toString(CryptoJS.enc.Hex);
            return decryptedHex
        } catch (err) {
            console.error('Error decrypting media:', err.message);
            throw err;
        }
    }
}
