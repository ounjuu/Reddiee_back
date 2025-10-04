import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 전체 상품 불러오기
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.findAll(); // 수정된 변수명
  }

  // ✅ 상품 상세 조회 추가
  @Get(':id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    return this.productsService.findOne(id);
  }

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
  // 상품 삭제
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productsService.remove(id);
  }

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
