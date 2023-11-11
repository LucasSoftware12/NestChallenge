import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqplib from 'amqplib/callback_api';

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;

  async onModuleInit() {
    await this.initialize();
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  async initialize() {
    try {
      this.connection = await new Promise<amqplib.Connection>(
        (resolve, reject) => {
          amqplib.connect(
            'amqp://guest:guest@localhost',
            (error, connection) => {
              if (error) {
                reject(error);
              }
              resolve(connection);
            },
          );
        },
      );

      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange('users', 'fanout', { durable: false });
      await this.channel.assertQueue('users-requested', { durable: false });
      await this.channel.bindQueue('users-requested', 'users', '');
    } catch (error) {
      console.error('Error al inicializar la conexión con RabbitMQ:', error);
    }
  }

  async publishEvenUsersToRabbitMQ(users: any[]) {
    try {
      if (!this.channel) {
        throw new Error('Channel is not initialized');
      }

      const evenUsers = users.filter((user) => user.id % 2 === 0);

      await this.channel.assertExchange('users', 'fanout', { durable: false });
      this.channel.publish('users', '', Buffer.from(JSON.stringify(evenUsers)));
      console.log('Mensajes publicados en el intercambio: users');
    } catch (error) {
      console.error('Error al publicar en el intercambio:', error);
    }
  }

  async closeConnection() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error('Error al cerrar la conexión con RabbitMQ:', error);
    }
  }
}
