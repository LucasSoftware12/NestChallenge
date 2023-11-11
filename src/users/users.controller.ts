import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { RabbitService } from './../rabbit/rabbit.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rabbitService: RabbitService,
  ) {}

  @Get()
  async getUsers() {
    const users = await this.usersService.getUsersFromAPI();

    await this.rabbitService.publishEvenUsersToRabbitMQ(users);
    return users;
  }
}
