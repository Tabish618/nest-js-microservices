import {HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'libs/common/dto/auth-dto/login.dto';
import { CreateUserDto } from 'libs/common/dto/user-dto/create-user.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private userClient: ClientProxy,
  private jwtService: JwtService
) {}

  async signup(dto: CreateUserDto) {
    const existingUser = await firstValueFrom (
      this.userClient.send(
      { cmd: 'get-user-by-email' },
      dto.email,
    )
  )

    if (existingUser) throw new RpcException({message: 'User already exists', statusCode: HttpStatus.BAD_REQUEST});

    const hashedPassword = await bcrypt.hash(dto.password, 10);

   return await firstValueFrom(
      this.userClient.send(
      { cmd: 'create-user' },
      { ...dto, password: hashedPassword },
     )
  )

  }

  async login(dto: LoginUserDto) {
    const user = await firstValueFrom (this.userClient.send(
      { cmd: 'get-user-by-email' },
      dto.email,
    )
  )

  if (!user) {
    throw new RpcException({ message: 'User not found', statusCode: 404 });
  }

  const isValid = await bcrypt.compare(dto.password, user.password);
  if (!isValid) {
    throw new RpcException({ message: 'Invalid password', statusCode: 401 });
  }

    // Remove password
    const { password, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = this.jwtService.sign(
      { id: user.id, email: user.email }
    );

    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    };
  }

  verifyToken(token: string ) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new RpcException('Invalid token');
    }
  }
}
