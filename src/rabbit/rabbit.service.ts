import { Injectable } from '@nestjs/common';
import * as amqp from `amqplib/callback_api`;

@Injectable()
export class RabbitService {
  async publishEvenUsers(users: any[]) {
    try {
      const connection = await this.connectToRabbitMQ();
      const channel = await connection.createChannel();

      const exchange = 'users';
      const queue = 'users-requested';

      channel.assertExchange(exchange, 'fanout', { durable: false });
      channel.assertQueue(queue, { durable: true });
      channel.bindQueue(queue, exchange, '');

      const evenUsers = users.filter((user: any) => user.id % 2 === 0);
      evenUsers.forEach((user: any) => {
        channel.publish(exchange, '', Buffer.from(JSON.stringify(user)));
      });

      setTimeout(() => {
        connection.close();
      }, 1000);
    } catch (error) {
      throw new Error('Error al publicar en RabbitMQ');
    }
  }

  private connectToRabbitMQ(): Promise<amqp.Connection> {
    return new Promise((resolve, reject) => {
      amqp.connect('amqp://guest:guest@localhost:5672', (error, connection) => {
        if (error) {
          reject(error);
        }
        resolve(connection);
      });
    });
  }
}
