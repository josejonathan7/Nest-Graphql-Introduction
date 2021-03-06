import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import dotenv from 'dotenv';
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.API_PORT || 3000, () => console.log('Running in the port: ', process.env.API_PORT || 3000));
}
bootstrap();

