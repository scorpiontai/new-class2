import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// "/home/scorpion/Public/new-class/src/classroomhandler/classroom.dto"
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { classroomObject } from 'src/CQRS/classroom.dto';
import { AesService } from 'src/aes/aes.service';
import { StoreFileService } from 'src/store-file/store-file.service';
import { Materys } from 'src/models/materys';
@WebSocketGateway({
  namespace: "/stream",
  cors: {
    origin: ['http://localhost:4000', 'http://localhost:2000', 'http://localhost:8080'],
  },
})
export class SocketGateway {
  constructor(private readonly commandBus: CommandBus,
    private readonly aes: AesService,
    private readonly storeFile: StoreFileService
  ) { }
  @WebSocketServer() server: Server;

  @SubscribeMessage("general")
  async join(client: any, payload: any): Promise<void> {
    try {
      const { area, code } = payload;
      const joinned = `${area}:${code}`

      client.join(joinned)
    } catch (err) {
      Logger.error(err.message);
    }
  }



  // this is stream all

  @SubscribeMessage("stream")
  async joinnerStream(client: any, payload: any): Promise<void> {
    try {
      const { area, code } = payload;
      const joinned = `${area}:${code}`

      client.join(joinned)
      console.debug("stream catch", joinned)
    } catch (err) {
      Logger.error(err.message);
    }
  }


  @SubscribeMessage("duh")
  async duh(client: any, payload: any): Promise<any> {
    try {
      const { emit, client, data } = payload
      console.debug("but scope", payload)
      console.debug("Duh scope", emit, client, data)
      await this.manualStream(emit, client, data)
    } catch (err) {
      console.error(err.message);
    }
  }

  async manualStream(emit: any, client: any, payload: any): Promise<any> {
    try {
      console.debug(emit, payload, payload)

      this.server.to(emit).emit(client, payload)
    } catch (err) {
      Logger.error(err.message)
    }
  }

  @SubscribeMessage("taskClassroom")
  async taskClassroom(client: any, payload: any): Promise<any> {
    try {
      console.debug("taskClassroom debug", payload.emit, payload.client)
      this.server.to(payload.emit).emit(payload.client, payload)
    } catch (err) {
      console.error(err.message);
    }
  }

  @SubscribeMessage("taskSubmit")
  async taskSubmit(client: any, payload: any): Promise<any> {
    try {
      const { message } = payload

    } catch (error) {
      Logger.error(error.message)
    }
  }

  @SubscribeMessage("matery")
  async matery(client: any, payload: any): Promise<any> {
    try {
      let { codeClass, title, content, filePath, tag, message, originalName, originalPath } = payload


      //classroomObjet is the out of directory, class-socket
      await this.commandBus.execute(new classroomObject("matery", title, content, filePath, codeClass, message, tag, originalName, originalPath))


      let fileIds = await Materys.findOne({
        where: {
          codeClass: await this.aes.encrypt(codeClass)
        },
        raw: true,
        order: [['createdAt', 'DESC']]
      });
     
      
      if(fileIds.filePath === null){
      this.server.to(`streaming:${codeClass}`).emit(`matery:${codeClass}`, payload)
      }else{
        let payloads = { codeClass:codeClass, title:title, content:content, filePath:filePath, tag:tag, message:message, originalName:originalName, 
          originalPath:originalPath, urlfile:`http://localhost:2000/api/show/video/${codeClass}/${title}?id=${fileIds.ID}`
        }
        this.server.to(`streaming:${codeClass}`).emit(`matery:${codeClass}`, payloads)
      }
    } catch (err) {
      Logger.error(err.message);
    }
  }

  @SubscribeMessage("notifreceiv")
  async notifreceiv(client: any, payload: any): Promise<any> {
    try {
      let { userID, data, resource } = payload
      console.debug("payload is", payload)
      this.server.to(`notif:${userID}`).emit(`${userID}:notif`, { data: data, resource: resource })
    } catch (err) {
      console.error(err.message);
    }
  }

}
