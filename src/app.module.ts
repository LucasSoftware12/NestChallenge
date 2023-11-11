import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module'; // Importa el módulo "users"
import { RabbitService } from './rabbit/rabbit.service';

@Module({
  imports: [UsersModule], // Agrega el módulo "users"
  providers: [RabbitService], // Agregar RabbitService como un proveedor
})
export class AppModule {}
