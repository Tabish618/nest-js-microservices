import { Controller, Post, Body, Inject, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginUserDto } from 'libs/common/dto/auth-dto/login.dto';
import { CreateUserDto } from 'libs/common/dto/user-dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return this.authClient.send({ cmd: 'register-user' }, data);
  }

  @Post('login')
  async login(@Body() data: LoginUserDto) {
    return this.authClient.send({ cmd: 'login-user' }, data)
  }
}
