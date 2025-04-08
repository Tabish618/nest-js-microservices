import { ConflictException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';

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
          throw new RpcException('User already exists');
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
}
