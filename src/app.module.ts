import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RabbitService } from './rabbit/rabbit.service';

@Module({
  imports: [UsersModule],
  providers: [RabbitService],
})
export class AppModule {}
