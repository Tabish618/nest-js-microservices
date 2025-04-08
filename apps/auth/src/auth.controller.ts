import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'register-user' })
  signup(data: CreateUserDto) {
    return this.authService.signup(data);
  }

  @MessagePattern({ cmd: 'login-user' })
  login(data: { email: string; password: string }) {
    return this.authService.login(data);
  }
}
