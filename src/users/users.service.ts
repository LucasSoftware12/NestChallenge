import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RabbitService } from './../rabbit/rabbit.service';

@Injectable()
export class UsersService {
  constructor(private readonly rabbitService: RabbitService) {}

  async getUsersFromAPI() {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/users',
    );
    const users = response.data.map((user: any) => {
      const { address, ...userWithoutAddress } = user;
      return userWithoutAddress;
    });
    return users.sort((a, b) => b.id - a.id);
  }

  async publishEvenUsersToRabbitMQ() {
    const users = await this.getUsersFromAPI();
    const evenUsers = users.filter((user: any) => user.id % 2 === 0);
    this.rabbitService.publishEvenUsersToRabbitMQ(evenUsers);
  }
}
