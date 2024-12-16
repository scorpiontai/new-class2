import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: ['http://localhost:2000', 'http://localhost:4000', 'http://localhost:8080'],
    credentials: true,
  });

  await app.listen(2000);
}

bootstrap();
