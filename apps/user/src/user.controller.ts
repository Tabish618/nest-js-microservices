import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from 'libs/common/dto/user-dto/create-user.dto';
import { UpdateUserDto } from 'libs/common/dto/user-dto/update-user.dto';


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

  @MessagePattern({ cmd: 'get-all-users' })
  async findAll() {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'get-user-by-id' })
  async findOne(@Payload() payload: { id: string }) {
  return this.userService.findOne(payload.id);
  }

  @MessagePattern({ cmd: 'update-user' })
  async update(@Payload() payload: { id: string; data: UpdateUserDto }) {
  return this.userService.update(payload.id, payload.data);
  }

  @MessagePattern({ cmd: 'delete-user' })
  async remove(@Payload() payload: { id: string }) {
  return this.userService.remove(payload.id);
  }
  
}
