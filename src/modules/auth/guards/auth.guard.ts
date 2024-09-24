import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/users/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('No se envio token');

    const secret = process.env.JWT_SECRET;
    try {
      const user = this.jwtService.verify(token, { secret });
      request.user = {
        ...user,
        roles: user.Role || [Role.Guest],
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
