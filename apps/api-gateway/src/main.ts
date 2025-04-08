// api-gateway/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config({ path: './apps/api-gateway/.env' });

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  await app.listen(parseInt(process.env.API_PORT || '3000'));

  console.log(`✅ API Gateway is running on port ${process.env.API_PORT}`);
}
bootstrap();
