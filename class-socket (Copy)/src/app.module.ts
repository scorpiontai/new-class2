import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket/socket.gateway';
import { CqrsModule } from '@nestjs/cqrs';
import { SequelizeModule } from '@nestjs/sequelize';
import { classUsers } from './classUsers';
import { TimeService } from './time/time.service';
import { classroomObject } from './CQRS/classroom.dto';
import { ClassroomHandler } from './CQRS/classroom.handler.service';
import { Materys } from './models/materys';
import { AesService } from './aes/aes.service';
import { IdService } from './id/id.service';
import { JwtkuService } from './jwt/jwtku.service';
import { JwtModule } from '@nestjs/jwt';
import { CloudService } from './cloud/cloud.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StoreFileService } from './store-file/store-file.service';
import { members } from './models/members';
import { ProfileController } from './profile/profile.controller';
@Module({
imports: [CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    JwtModule.register({
      global: true,
      secret: "secreet",
    }),
    SequelizeModule.forRoot({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'password',
        database: 'test',
        models: [Materys,classUsers,members],
        autoLoadModels: true,
        synchronize: true,
    }),
  ],
  controllers: [AppController, ProfileController],
  providers: [AppService, SocketGateway, TimeService,ClassroomHandler, AesService, IdService, JwtkuService, CloudService, StoreFileService],
})
export class AppModule {}
