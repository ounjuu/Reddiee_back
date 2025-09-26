import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like } from './like.entity';
import { Product } from 'src/product/product.entity';
import { User } from '@/users/user.entity';

// 모듈
import { UsersModule } from 'src/users/users.module'; // ✅ 추가
import { ProductsModule } from 'src/product/products.module'; // ✅ 추가

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Product, User]),
    UsersModule,
    ProductsModule,
  ],
  providers: [LikesService],
  controllers: [LikesController],
  exports: [LikesService], // 필요 시 다른 모듈에서 사용 가능
})
export class LikesModule {}
