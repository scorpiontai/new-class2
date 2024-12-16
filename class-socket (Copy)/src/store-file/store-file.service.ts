import { Injectable } from '@nestjs/common';
import e from 'express';
import * as fs from 'fs'
import { AesService } from 'src/aes/aes.service';
import { classUsers } from 'src/classUsers';
import { Materys } from 'src/models/materys';

@Injectable()
export class StoreFileService {
    constructor(private readonly aes: AesService) { }


    async storeFile(codeClass: string, fileName: string): Promise<any> {
        try {

            const find = await Materys.findOne({
                where: {
                    codeClass: codeClass
                }, raw: true
            })



            if (find !== undefined || find !== null)
                //create at firs time
                await Materys.update({ filePath: fileName }, {
                    where: { codeClass: codeClass }
                })

            else
                console.debug("there is not valid action")

            console.debug("materys update")
        } catch (err) {
            console.error(err.message);
        }
    }



    async fileNameSet(name: any, codeClass: string): Promise<any> {
        try {
            name = name.split(".")
            let aesName = await this.aes.encrypt(name[0])
            return `${aesName}:${codeClass}.${name[1]}`
        } catch (err) {
            console.error(err.message);
        }
    }
    
    async fileStore(data: any, name: any, codeClass: string): Promise<any> {
        try {

            const totalFileName = await this.fileNameSet(name, codeClass)
            console.debug("file store", totalFileName)
            fs.writeFileSync(totalFileName, Buffer.from(data, 'hex'))
           
            const find = await Materys.findAll({where:{
                codeClass:codeClass}, raw:true})
            return true
        } catch (err) {
            console.error(err.message);
        }
    }
}
