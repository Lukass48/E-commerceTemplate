import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';
import { Role } from '../users/roles.enum';
import { EmailService } from 'src/modules/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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

    const verificationToken = this.jwtService.sign(
      { id: newUser.id, email: newUser.email }, // Información contenida en el token
      { secret: process.env.JWT_SECRET, expiresIn: '1h' }, // Tiempo de expiración
    );

    // Crear URL de verificación de email
    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

    // Enviar email de verificación
    await this.emailService.sendVerificationEmail(
      newUser.email,
      'Verifica tu email',
      newUser.name || 'Usuario',
      verificationUrl,
    );

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

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch {
      throw new BadRequestException(
        'Token de verificación inválido o expirado',
      );
    }
  }

  // Método público para marcar el email como verificado
  async markEmailAsVerified(userId: number): Promise<void> {
    await this.usersRepository.markEmailAsVerified(userId);
  }
}
