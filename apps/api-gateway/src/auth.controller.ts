import { Controller, Post, Body, Inject, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('register')
  async register(@Body(ValidationPipe) data: CreateUserDto) {
    return this.authClient.send({ cmd: 'register-user' }, data);
  }

  @Post('login')
  async login(@Body(ValidationPipe) data: { email: string; password: string }) {
    return this.authClient.send({ cmd: 'login-user' }, data);
  }
}
