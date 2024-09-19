import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';
import { Role } from '../users/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getAuth() {
    return 'Autenticacion';
  }

  async signUp(user: Partial<Users>) {
    const { email, password } = user;

    const foundUser = await this.usersRepository.getUserByEmail(email);
    if (foundUser) throw new BadRequestException('El usuario ya existe');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersRepository.addUser({
      ...user,
      password: hashedPassword,
      role: Role.Guest,
    });

    await this.usersRepository.updateUserRole(newUser.id, Role.User);

    return newUser;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) throw new BadRequestException('Credenciales Incorrectas');

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword)
      throw new BadRequestException('Credenciales Incorrectas');
    const payload = { id: user.id, email: user.email, Role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'El usuario se logueo correctamente',
      token,
    };
  }
}
