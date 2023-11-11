import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RabbitService } from './../rabbit/rabbit.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RabbitService],
})
export class UsersModule {}
