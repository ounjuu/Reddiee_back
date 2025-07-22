import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    imageUrl?: string,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      imageUrl,
    });
    return await this.productRepository.save(product);
  }
}
