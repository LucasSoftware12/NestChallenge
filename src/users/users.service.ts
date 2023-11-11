/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UsersService {
  async getFilteredAndSortedUsers() {
    try {
      const apiUrl = 'https://jsonplaceholder.typicode.com/users';
      const response = await axios.get(apiUrl);

      const users = response.data;
      const filteredUsers = users.map((user: any) => {
        const { address, ...userWithoutAddress } = user;
        return userWithoutAddress;
      });

      const sortedUsers = filteredUsers.sort((a, b) => b.id - a.id);
      return sortedUsers;
    } catch (error) {
      throw new Error('No se pudieron obtener los usuarios');
    }
  }
}
