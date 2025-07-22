import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: string;

  description?: string;

  @IsNotEmpty()
  category: string;
}
