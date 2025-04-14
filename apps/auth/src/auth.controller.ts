import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'libs/common/dto/user-dto/create-user.dto';
import { LoginUserDto } from 'libs/common/dto/auth-dto/login.dto';


@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'register-user' })
  signup(data: CreateUserDto) {
    return this.authService.signup(data);
  }

  @MessagePattern({ cmd: 'login-user' })
  login(data: LoginUserDto) {
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'verify-token' })
  verifyToken(@Payload() payload: { token: string }) {
  return this.authService.verifyToken(payload.token);
  }

}
