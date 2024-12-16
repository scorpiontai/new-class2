import { Controller, Get, Res, Req, Query, Param, Post, Body, UseInterceptors, UploadedFile, UseGuards, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import * as path from 'path'
import { JwtkuService } from './jwt/jwtku.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudService } from './cloud/cloud.service';
import { AesService } from './aes/aes.service';
import { StoreFileService } from './store-file/store-file.service';
import { get } from 'http';
import * as fs from 'fs/promises';
import { error } from 'console';
import { Materys } from './models/materys';
import { ShowfileGuard } from './showfile/showfile.guard';
import { JwtService } from '@nestjs/jwt';
import { IdService } from './id/id.service';
@Controller("api/")
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly jwt: JwtkuService,
    private readonly cloud: CloudService,
    private readonly aes: AesService,
    private readonly storeFile: StoreFileService,
    private readonly jwts: JwtService,
    private readonly ids: IdService
  ) { }

  @Get("up")
  async getHello(@Res() res: Response, @Req() req: Request) {
    try {
      res.sendFile(path.resolve("./src/socket/html/socket.html"))
    } catch (error) {
      console.error(error.message)
    }
  }

  @Post("up/:codeClass")
  @UseInterceptors(FileInterceptor("file"))
  async set(@Param("codeClass") codeClass: string, @UploadedFile() file: any, @Res() res: Response, @Req() req: Request, @Body() body: any): Promise<any> {
    try {
      const { title } = body
      let message

      const store = await this.storeFile.fileStore(file.buffer, file.originalname, codeClass)
      let fileName = await this.storeFile.fileNameSet(file.originalname, codeClass)

      const fileEnc = await this.aes.encrypt(file.originalname)
      const codeClassEnc = await this.aes.encrypt(codeClass)

      const all = `${fileEnc}:${codeClassEnc}.${file.originalname.split(".").pop()}`
      if (store) {
        Logger.debug("all", codeClassEnc)
        console.debug("fileName", fileName)
        let fileIds = await Materys.findOne({
          where: {
            codeClass: codeClassEnc
          },
          raw: true,
          attributes: ['ID'],
          order: [['createdAt', 'DESC']]
        });
        // res.status(200).json({ id: fo })
        // video / classCode / title 
        const result = `http://localhost:2000/api/show/video/${codeClass}/${title}?id=${fileIds.ID}`

        res.status(200).json({ id: result })
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  @Get("list/show/video/id/:classCode")
  async showListVideo(@Res() res: Response, @Req() req: Request, @Param("classCode") classCode: any): Promise<any> {
    try {
      // curl http://localhost:2000/api/list/show/video/id/813072d1-684b-4d4b-ba49-62c2a2d0cb5e
      classCode = await this.aes.encrypt(classCode)
      const find = await Materys.findAll({
        where: {
          codeClass: classCode
        }, raw: true
      })

      res.status(200).json({ list: find.map(item => item.ID) })
    } catch (err) {
      console.error(err.message);
    }
  }
  // @UseGuards(ShowfileGuard)
  //handling media 
  @Get("show/video/:classCode/:title")
  async handlingShowMedia(@Param("classCode") classCode: any,
    @Query("token") token: any, @Param("title") title: any, @Query("id") id: any, @Res() res: Response, @Req() req: Request, @Param("filePath") filePath: any): Promise<any> {
    try {
      let decodeClassCode = classCode
      title = title.split("%20")
      console.debug(title)
      title = await this.aes.encrypt(title[0])
      classCode = await this.aes.encrypt(classCode)

      const find = await Materys.findOne({
        where: {
          title: title, codeClass: classCode, ID: parseInt(id)
        }, raw: true
      })

      let openedFile = find.filePath.split(":")
      let extFile = openedFile[1].split(".").pop()

      // http://localhost:2000/api/show/video/813072d1-684b-4d4b-ba49-62c2a2d0cb5e/caesaripus?id=70

      res.sendFile(path.resolve(`${openedFile[0]}:${decodeClassCode}.${extFile}`))
    } catch (err) {
      console.error(err.message);
    }
  }


  @Get("/dec")
  async dec(@Res() res: Response): Promise<any> {
    try {
      let dec = await this.aes.decrypt('FFjSlp6IQpnVWwbb+pX/lA==')
      res.status(200).json(dec)
    } catch (err) {
      console.error(err.message);
    }

  }

  @Post("update/profile/image")
  //http://localhost:2000/api/update/profile/image?token=
  @UseInterceptors(FileInterceptor("file"))
  async updateProfile(@Req() req: Request, @Res() res: Response,
    @Query("token") token: any, @UploadedFile() file: any): Promise<any> {
    try {
      token = await this.jwts.decode(token)
      token = token.userName


      console.debug(token)
      const fileBuffer = file.buffer
      console.debug(fileBuffer)
      const userID = await this.ids.findTheNameWithId(token)

      console.debug(userID)
      await this.cloud.sendCloud(fileBuffer, "profile", userID)
    } catch (err) {
      console.error(err.message);
    }
  }
  @Get("list/matery/:classCode")
async materyClssCode(
  @Res() res: Response,
  @Req() req: Request,
  @Param("classCode") classCode: any
): Promise<any> {
  try {
    classCode = await this.aes.encrypt(classCode);

    const find = await Materys.findAll({
      where: {
        codeClass: classCode,
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const matery = await this.processData(find);

    res.status(200).json({ matery, classCodeEnc: classCode });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Terjadi kesalahan saat memuat data." });
  }
}

async processData(find: any[]): Promise<any[]> {
  return await Promise.all(
    find.map(async (task) => {
      const decryptedTask: any = {};

   
      decryptedTask.id = task.ID; 
      
  
      for (const key in task) {
        if (task[key] && key !== 'ID') {
          decryptedTask[key] = await this.aes.decrypt(task[key]);
        } else {
          decryptedTask[key] = task[key];
        }
      }

   
      decryptedTask['createdAt'] = new Date(task.createdAt).toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, 
      });

      return decryptedTask;
    })
  );
}


  

  @Get("list/matery/:next")
  async materyNext(@Res() res: Response, @Req() req: Request, @Param("next") next: any): Promise<any> {
    try {
     
    } catch (err) {
      console.error(err.message);
    }
  }

}