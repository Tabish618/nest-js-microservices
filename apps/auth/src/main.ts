import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import * as dotenv from 'dotenv';

dotenv.config({ path: './apps/auth/.env' });

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.AUTH_PORT || '3001'),
    },
  });

  await app.listen();
  console.log(`Auth microservice is running on port ${process.env.AUTH_PORT}`);
}
bootstrap();
