import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto } from 'libs/common/dto/user-dto/create-user.dto';
import { UpdateUserDto } from 'libs/common/dto/user-dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
      try {
        const { email } = createUserDto;
  
        const existingUser = await this.userRepo.findOne({
          where: { email },
        });
  
        if (existingUser) {
          throw new RpcException({message: 'User already exists', statusCode: HttpStatus.BAD_REQUEST});
        }

        const newUser = this.userRepo.create(createUserDto);
        await this.userRepo.save(newUser);
        const { password, ...userWithoutPassword } = newUser;
        return {
          status: HttpStatus.CREATED,
          message: 'User created successfully',
          data: userWithoutPassword,
        }
      } catch (error) {
        if (error instanceof RpcException) {
          throw error;
        }

        console.error('Create user failed:', error);
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  

  async findByEmail(email: string) {
    try{
      return this.userRepo.findOne({ where: { email } });
    }catch(error){
       console.error('Error finding user by email:', error);

      throw error
    }
    
  }


  async findAll() {
    try {
      const users = await this.userRepo.find();
      return {
        status: 'success',
        data: users,
      };
    } catch (error) {
      throw new RpcException('Failed to fetch users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });

      if (!user) {
        throw new RpcException({
          message: `User with id ${id} not found`,
          statusCode: 404,
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'User found successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;

      console.error('Find user failed:', error);
      throw new RpcException('Failed to fetch user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });

      if (!user) {
        throw new RpcException({
          message: `User with id ${id} not found`,
          statusCode: 404,
        });
      }

      const updatedUser = Object.assign(user, updateUserDto);
      await this.userRepo.save(updatedUser);

      return {
        status: HttpStatus.OK,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;

      console.error('Update user failed:', error);
      throw new RpcException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });

      if (!user) {
        throw new RpcException({
          message: `User with id ${id} not found`,
          statusCode: 404,
        });
      }

      await this.userRepo.remove(user);

      return {
        status: HttpStatus.OK,
        message: 'User deleted successfully',
        deletedUser: user
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;

      console.error('Delete user failed:', error);
      throw new RpcException('Failed to delete user');
    }
  }
}