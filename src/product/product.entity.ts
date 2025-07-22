import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  imageUrl?: string;
}
