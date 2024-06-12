import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) { }

  async createUser(users: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
    const nicknameExists = await this.usersRepository.exists({
      where: {
        nickname: users.email,
      },
    });

    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 nickname입니다!');
    }

    const emailExists = await this.usersRepository.exists({
      where: {
        email: users.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 email입니다!');
    }

    const userObject = this.usersRepository.create({
      nickname: users.nickname,
      email: users.email,
      password: users.password,
    });

    const newUser = await this.usersRepository.save(userObject);

    return newUser;
  }

  async getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
}
