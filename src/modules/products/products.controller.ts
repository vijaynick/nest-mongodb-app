import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('available')
  findAvailableProducts() {
    return this.productsService.findAvailableProducts();
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.productsService.findByCategory(category);
  }

  @Get('price-range')
  findByPriceRange(
    @Query('min') minPrice: string,
    @Query('max') maxPrice: string,
  ) {
    return this.productsService.findByPriceRange(
      parseFloat(minPrice),
      parseFloat(maxPrice),
    );
  }

  // REMOVE ParseObjectIdPipe - let service handle it
  @Get('owner/:ownerId')
  findByOwner(@Param('ownerId') ownerId: string) {
    return this.productsService.findByOwner(ownerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  updateStock(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(id, quantity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Get('debug/owners')
  debugOwners() {
    return this.productsService.debugCheckOwners();
  }

  @Post('migrate/owners')
  @HttpCode(HttpStatus.OK)
  migrateOwners() {
    return this.productsService.migrateOwnersToObjectId();
  }
}
