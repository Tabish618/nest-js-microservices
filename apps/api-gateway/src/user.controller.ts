import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Inject,
    ValidationPipe,
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';
  
  @Controller('users')
  export class UserController {
    constructor(
      @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    ) {}
  
    @Post()
    async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
      return this.userClient.send({ cmd: 'create-user' }, createUserDto);
    }
  
    @Get()
    async findAllUsers() {
      return this.userClient.send({ cmd: 'get-all-users' }, {});
    }
  
    @Get(':id')
    async findUserById(@Param('id') id: string) {
      return this.userClient.send({ cmd: 'get-user-by-id' }, { id });
    }
  }
  