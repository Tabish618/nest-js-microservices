// api-gateway/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import * as dotenv from 'dotenv';
import { RpcToHttpExceptionFilter } from 'libs/common/filters/rpchttp-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from 'libs/common/filters/validation-exception.filter';

dotenv.config({ path: 'apps/api-gateway/.env' });

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Register global filters
  app.useGlobalFilters(
    new RpcToHttpExceptionFilter(), // catches RPC exceptions
    new ValidationExceptionFilter(), // catches validation errors (optional but recommended)
  );

  await app.listen(parseInt(process.env.API_PORT || '3000'));

  console.log(`✅ API Gateway is running on port ${process.env.API_PORT}`);
}
bootstrap();
