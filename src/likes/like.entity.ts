import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Product } from 'src/product/product.entity';

@Entity('likes')
@Unique(['user', 'product'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, (product) => product.likes, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  created_at: Date;
}
