import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { classroomObject } from './classroom.dto';
import { TimeService } from 'src/time/time.service';
import { classUsers } from 'src/classUsers';
import { Materys } from 'src/models/materys';
import { AesService } from 'src/aes/aes.service';
import { IdService } from 'src/id/id.service';
import { StoreFileService } from 'src/store-file/store-file.service';
@CommandHandler(classroomObject)
export class ClassroomHandler implements ICommandHandler<classroomObject> {
    constructor(private readonly time: TimeService,
        private readonly aes: AesService,
        private readonly id: IdService,
        private readonly storeFile: StoreFileService
    ) { }

    async checkMatery(extFile: any): Promise<any> {
        try {
            extFile = [extFile]
            console.debug(extFile.include("html"))
        } catch (err) {
            console.error(err.message);
        }
    }
    async giveMatery(codeClass: string, title: string, content: string, filePath: string, topic: string, originalFileName: string, originalPath: string): Promise<any> {
        try {
            const dateTime = await this.time.getTImeFormatSQL()
            const time = await this.time.getOnlyTime()

            const className = await this.id.findAttributeWithCodeClass(codeClass)


            codeClass = await this.aes.encrypt(codeClass)
            title = await this.aes.encrypt(title)
            content = await this.aes.encrypt(content)
            topic = await this.aes.encrypt(topic)

            let fileName = await this.storeFile.fileNameSet(originalFileName, codeClass)


            await Materys.create({
                codeClass: codeClass,
                className: await this.aes.encrypt(className.className),
                classID: className.classID,
                title: title,
                content: content,
                filePath: fileName,
                topic: topic,
                fileType: originalPath
            })

        

        } catch (err) {
            console.error(err.meassage)
        }
    }

    async execute(command: classroomObject): Promise<any> {
        try {
            const { db, title, content, filePath, classCode, message, tag, fileName, originalPath } = command

            switch (db) {
                case "matery":
                    await this.giveMatery(classCode, title, content, filePath, tag, fileName, originalPath)
                    console.debug("message is", message)
                    break
            }
            Logger.log(command)
        } catch (error) {
            Logger.error(error.message)
        }
    }
}
/*
codeClass: this.classCode,
title: this.judul,
content: this.deskripsi,
tag: 'tes',
message: 'yang rajin ya',
originalName: this.file ? this.file.name : null,
originalPath: this.file ? this.file.name.split('.').pop() : null
*/
