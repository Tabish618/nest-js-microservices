import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import * as dotenv from 'dotenv';
import { AuthGuard } from 'libs/common/guard/auth.guard';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
        host: process.env.AUTH_HOST || '0.0.0.0',
        port: parseInt(process.env.AUTH_PORT || '3001'),
        }
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_HOST || '0.0.0.0',
          port: parseInt(process.env.USER_PORT || '3002'),
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController, AuthController, UserController],
  providers: [ApiGatewayService, AuthGuard],
})
export class ApiGatewayModule {}
