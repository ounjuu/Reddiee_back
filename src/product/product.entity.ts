import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cart } from '../cart/cart.entity'; // ✅ 추가

@Entity('products') // 테이블명 명시
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 }) // ✅ 금액 필드는 보통 precision/scale 지정
  price: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  imageUrl?: string;

  // ✅ Cart와의 관계 (1:N)
  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];
}
