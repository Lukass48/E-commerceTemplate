import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { UsersController } from '../users/users.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), EmailModule],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService, UsersRepository],
  exports: [],
})
export class AuthModule {}
