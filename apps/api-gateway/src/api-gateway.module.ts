import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
        host: process.env.HOST || 'localhost',
        port: parseInt(process.env.AUTH_PORT || '3001'),
        }
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST || 'localhost',
          port: parseInt(process.env.USER_PORT || '3002'),
        },
      },
    ]),
  ],
  controllers: [AuthController, UserController],
})
export class ApiGatewayModule {}
