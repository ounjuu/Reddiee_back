import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  imageUrl?: string;
}
