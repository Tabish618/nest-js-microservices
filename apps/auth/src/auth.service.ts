import { ConflictException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
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

    if (existingUser) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

   return await firstValueFrom(
      this.userClient.send(
      { cmd: 'create-user' },
      { ...dto, password: hashedPassword },
     )
  )

  }

  async login(dto: { email: string; password: string }) {
    const user = await firstValueFrom (this.userClient.send(
      { cmd: 'get-user-by-email' },
      dto.email,
    )
  )

    if (!user) throw new Error('User not found');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new Error('Invalid password');

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
}
