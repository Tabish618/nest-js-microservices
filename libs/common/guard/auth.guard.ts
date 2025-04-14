// libs/common/src/guards/auth.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers['authorization'];

      if (!authHeader || !authHeader.startsWith("Bearer"))
        throw new UnauthorizedException('Invalid or missing token');
  
      const token = authHeader.split(' ')[1];
  
      try {
        const user = await firstValueFrom(
          this.authClient.send({ cmd: 'verify-token' }, { token }),
        );
        req.user = user;
        return true;
      } catch (err) {
        console.log(err)
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
  