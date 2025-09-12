import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { User } from '../users/user.entity';
import { Product } from '@/product/product.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // 장바구니 추가/업데이트
  async addToCart(user: User, productId: number, quantity: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new Error('상품이 존재하지 않습니다.');

    let cart = await this.cartRepo.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
    });

    if (cart) {
      cart.quantity += quantity;
    } else {
      cart = this.cartRepo.create({ user, product, quantity });
    }

    return this.cartRepo.save(cart);
  }

  // 장바구니 조회
  //   async getCart(user: User) {
  //     return this.cartRepo.find({ where: { user: { id: user.id } } });
  //   }

  async getCart(user: User) {
    return this.cartRepo.find({
      where: { user: { id: user.id } },
      relations: ['product'], // Product 정보 포함
    });
  }

  // 장바구니 아이템 삭제
  async removeFromCart(user: User, productId: number) {
    return this.cartRepo.delete({
      user: { id: user.id },
      product: { id: productId },
    });
  }
}
