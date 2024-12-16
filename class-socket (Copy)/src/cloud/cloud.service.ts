import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Zlib } from 'zlib';
import axios from 'axios';
import { Materys } from 'src/models/materys';
import { AesService } from 'src/aes/aes.service';
@Injectable()
export class CloudService {
  constructor(private configService: ConfigService,
    private readonly aes: AesService
  ) {
    cloudinary.config({
      cloud_name: 'davsvplok',
      api_key: '678553969955757',
      api_secret: 'kZjqr7FkEK8hbuYhIqQzrnN1eio',

    })

    // a50b57b2-00fb-4d79-b468-323c6c604c24
    // 9KtQKqM7R7HyuB0ivUyBDllEgHkUf3Tj

  }


  async sendCloud(buffer: any, type: string, userID: number): Promise<string> {
    try {
      console.debug(userID)
      if (type === "profile") {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            async (error, uploadResult) => {
              if (error) {
                return reject(new Error("Upload failed: " + error.message));
              }
  
              try {
                await Materys.update(
                  { profilePath: uploadResult.secure_url },
                  { where: { ID: userID } }
                );
                resolve(uploadResult.secure_url);
              } catch (updateError) {
                reject(
                  new Error("Database update failed: " + updateError.message)
                );
              }
            }
          );
  
          uploadStream.end(buffer);
        });
      } else {
        throw new Error("Unsupported type provided");
      }
    } catch (error) {
      throw new Error("Error in sendCloud: " + error.message);
    }
  }
  
  async sendVideo(fileBuffer: Buffer, fileName: string): Promise<any> {
    try {

      const enc = await this.aes.encryptMedia(fileBuffer)
      await this.aes.decryptMedia(enc)

    } catch (err) {
      console.error(err.message || 'An error occurred during file upload');
    }
  }

}
