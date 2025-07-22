import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const imageUrl = image ? `/uploads/${image.filename}` : null;
    const product = await this.productsService.create(
      createProductDto,

      imageUrl,
    );

    return {
      message: '상품 등록 성공',
      data: product,
    };
  }
}
