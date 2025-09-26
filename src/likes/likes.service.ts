import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async addLike(userId: number, productId: number): Promise<Like> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!user || !product)
      throw new NotFoundException('User or Product not found');

    const existing = await this.likeRepo.findOne({ where: { user, product } });
    if (existing) throw new ConflictException('Already liked');

    const like = this.likeRepo.create({ user, product });
    return this.likeRepo.save(like);
  }

  async removeLike(userId: number, productId: number): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!user || !product)
      throw new NotFoundException('User or Product not found');

    await this.likeRepo.delete({ user, product });
  }

  async countLikes(productId: number): Promise<number> {
    return this.likeRepo.count({ where: { product: { id: productId } } });
  }

  async getUserLikes(userId: number): Promise<Like[]> {
    return this.likeRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }
}
