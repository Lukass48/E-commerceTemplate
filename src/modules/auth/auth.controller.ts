import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
