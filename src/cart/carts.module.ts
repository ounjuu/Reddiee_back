import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Product } from '../product/product.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, User])],
  providers: [CartsService],
  controllers: [CartsController],
})
export class CartsModule {}
