import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../product/product.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.carts, { eager: true })
  user: User;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column({ default: 1 })
  quantity: number;
}
