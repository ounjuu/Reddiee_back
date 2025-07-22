import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateProductDto } from './dto/create-product.dto';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // 저장 경로
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log('등록된 상품:', createProductDto);
    console.log('업로드된 이미지:', image?.filename);

    return {
      message: '상품 등록 성공',
      data: {
        ...createProductDto,
        imageUrl: image ? `/uploads/${image.filename}` : null,
      },
    };
  }
}
