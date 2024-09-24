import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/Dtos/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuth() {
    return this.authService.getAuth();
  }

  @Post('signup')
  signup(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  @Post('signin')
  async signIn(@Body() Credentials: LoginUserDto) {
    const { email, password } = Credentials;
    return this.authService.signIn(email, password);
  }
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<string> {
    try {
      // Verifica el token usando el método público de AuthService
      const decoded = this.authService.verifyToken(token);

      // Marca el email como verificado en la base de datos
      await this.authService.markEmailAsVerified(decoded.id);

      return 'Email verificado con éxito';
    } catch {
      throw new BadRequestException(
        'Token de verificación inválido o expirado',
      );
    }
  }
}
