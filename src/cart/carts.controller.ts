import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  addToCart(@Req() req, @Body() body: { productId: number; quantity: number }) {
    return this.cartsService.addToCart(req.user, body.productId, body.quantity);
  }

  @Get()
  getCart(@Req() req) {
    return this.cartsService.getCart(req.user);
  }

  @Delete(':productId')
  removeFromCart(@Req() req, @Param('productId') productId: number) {
    return this.cartsService.removeFromCart(req.user, productId);
  }
}
