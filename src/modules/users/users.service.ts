import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  addUser(user: any) {
    return this.usersRepository.addUser(user);
  }

  getUserByEmail(email: string) {
    return this.usersRepository.getUserByEmail(email);
  }
}
