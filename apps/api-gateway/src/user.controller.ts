import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Inject,
    UseGuards,
    Put,
    Delete,
    Patch,
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'libs/common/dto/user-dto/create-user.dto';
import { UpdateUserDto } from 'libs/common/dto/user-dto/update-user.dto';
import { AuthGuard } from 'libs/common/guard/auth.guard';

  @Controller('users')
  export class UserController {
    constructor(
      @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    ) {}
  
    // @Post()
    // async createUser(@Body() createUserDto: CreateUserDto) {
    //   return this.userClient.send({ cmd: 'create-user' }, createUserDto);
    // }
    @UseGuards(AuthGuard)
    @Get()
    async findAllUsers() {
      return this.userClient.send({ cmd: 'get-all-users' }, {});
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findUserById(@Param('id') id: string) {
      return this.userClient.send({ cmd: 'get-user-by-id' }, { id });
    }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userClient.send(
      { cmd: 'update-user' },
      { id, data:updateUserDto },
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userClient.send({ cmd: 'delete-user' }, { id });
  }
  }
  