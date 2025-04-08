import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';


@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern({ cmd: 'get-user-by-email' })
  async getUserByEmail(email: string) {
    return this.userService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'create-user' })
  async createUser(data: CreateUserDto) {
    return this.userService.createUser(data);
  }
}
