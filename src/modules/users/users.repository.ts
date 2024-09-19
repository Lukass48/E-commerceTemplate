import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { Role } from './roles.enum';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async addUser(user: Partial<Users>): Promise<Users> {
    return this.usersRepository.save(user);
  }

  async updateUserRole(userId: string, role: Role): Promise<void> {
    await this.usersRepository.update(userId, { role });
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}
