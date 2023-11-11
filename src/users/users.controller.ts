import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { RabbitService } from '../rabbit/rabbit.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rabbitService: RabbitService,
  ) {}

  @Get()
  async getUsersAndPublishEvenUsers() {
    // Obtener todos los usuarios
    const allUsers = await this.usersService.getFilteredAndSortedUsers();

    // Publicar usuarios con ID par en RabbitMQ
    await this.rabbitService.publishEvenUsers(allUsers);

    return allUsers; // Devolver todos los usuarios
  }
}
