import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  async addToCart(user: User, productId: number, quantity: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('상품이 존재하지 않습니다.');

    let cart = await this.cartRepo.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
    });

    if (cart) {
      cart.quantity += quantity;
    } else {
      cart = this.cartRepo.create({ user, product, quantity } as Partial<Cart>);
    }

    return this.cartRepo.save(cart);
  }

  async getCart(user: User) {
    const items = await this.cartRepo.find({
      where: { user: { id: user.id } },
      relations: ['product'],
    });

    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * Number(item.product.price),
      0,
    );

    return { items, totalPrice };
  }

  async removeFromCart(user: User, productId: number) {
    const result = await this.cartRepo.delete({
      user: { id: user.id },
      product: { id: productId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('삭제할 장바구니 아이템이 없습니다.');
    }

    return { success: true };
  }

  async updateQuantity(user: User, productId: number, quantity: number) {
    if (quantity < 1)
      throw new BadRequestException('수량은 1 이상이어야 합니다.');

    const cart = await this.cartRepo.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
    });

    if (!cart)
      throw new NotFoundException('장바구니 아이템이 존재하지 않습니다.');

    cart.quantity = quantity;
    return this.cartRepo.save(cart);
  }

  async clearCart(user: User) {
    await this.cartRepo.delete({ user: { id: user.id } });
    return { success: true };
  }
}
