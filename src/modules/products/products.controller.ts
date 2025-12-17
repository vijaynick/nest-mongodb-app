/* Implemented swagger as normal practice */
// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   HttpCode,
//   HttpStatus,
//   Query,
// } from '@nestjs/common';
// import { ProductsService } from './products.service';
// import { CreateProductDto, UpdateProductDto } from './dto';
// import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiParam,
//   ApiQuery,
//   ApiBody,
// } from '@nestjs/swagger';

// @ApiTags('products')
// @Controller('products')
// export class ProductsController {
//   constructor(private readonly productsService: ProductsService) {}

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   @ApiOperation({ summary: 'Create a new product' })
//   @ApiBody({ type: CreateProductDto })
//   @ApiResponse({
//     status: 201,
//     description: 'The product has been successfully created.',
//     schema: {
//       example: {
//         _id: '6941c9ca06b8bd1830f6f359',
//         name: 'Laptop',
//         description: 'High-performance laptop',
//         price: 1299.99,
//         stock: 15,
//         isAvailable: true,
//         categories: ['electronics', 'computers'],
//         owner: '6941c93806b8bd1830f6f353',
//         createdAt: '2025-12-16T10:00:00.000Z',
//         updatedAt: '2025-12-16T10:00:00.000Z',
//       },
//     },
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Bad Request - Validation failed or owner does not exist.',
//   })
//   create(@Body() createProductDto: CreateProductDto) {
//     return this.productsService.create(createProductDto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all products' })
//   @ApiResponse({
//     status: 200,
//     description:
//       'Returns an array of all products with populated owner details.',
//     schema: {
//       example: [
//         {
//           _id: '6941c9ca06b8bd1830f6f359',
//           name: 'Laptop',
//           description: 'High-performance laptop',
//           price: 1299.99,
//           stock: 15,
//           isAvailable: true,
//           categories: ['electronics', 'computers'],
//           owner: {
//             _id: '6941c93806b8bd1830f6f353',
//             name: 'John Seller',
//             email: 'john.seller@example.com',
//           },
//           createdAt: '2025-12-16T10:00:00.000Z',
//           updatedAt: '2025-12-16T10:00:00.000Z',
//         },
//       ],
//     },
//   })
//   findAll() {
//     return this.productsService.findAll();
//   }

//   @Get('available')
//   @ApiOperation({ summary: 'Get all available products' })
//   @ApiResponse({
//     status: 200,
//     description:
//       'Returns an array of products that are available and in stock.',
//   })
//   findAvailableProducts() {
//     return this.productsService.findAvailableProducts();
//   }

//   @Get('category/:category')
//   @ApiOperation({ summary: 'Get products by category' })
//   @ApiParam({
//     name: 'category',
//     description: 'Category name to filter products',
//     example: 'electronics',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Returns an array of products in the specified category.',
//   })
//   findByCategory(@Param('category') category: string) {
//     return this.productsService.findByCategory(category);
//   }

//   @Get('price-range')
//   @ApiOperation({ summary: 'Get products within a price range' })
//   @ApiQuery({
//     name: 'min',
//     description: 'Minimum price',
//     example: 0,
//     required: true,
//   })
//   @ApiQuery({
//     name: 'max',
//     description: 'Maximum price',
//     example: 1000,
//     required: true,
//   })
//   @ApiResponse({
//     status: 200,
//     description:
//       'Returns an array of products within the specified price range.',
//   })
//   findByPriceRange(
//     @Query('min') minPrice: string,
//     @Query('max') maxPrice: string,
//   ) {
//     return this.productsService.findByPriceRange(
//       parseFloat(minPrice),
//       parseFloat(maxPrice),
//     );
//   }

//   // REMOVE ParseObjectIdPipe - let service handle it
//   @Get('owner/:ownerId')
//   @ApiOperation({ summary: 'Get all products by owner' })
//   @ApiParam({
//     name: 'ownerId',
//     description: 'MongoDB ObjectId of the owner (user)',
//     example: '6941c93806b8bd1830f6f353',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Returns an array of products owned by the specified user.',
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Bad Request - Invalid ObjectId format.',
//   })
//   findByOwner(@Param('ownerId') ownerId: string) {
//     return this.productsService.findByOwner(ownerId);
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get a product by ID' })
//   @ApiParam({
//     name: 'id',
//     description: 'MongoDB ObjectId of the product',
//     example: '6941c9ca06b8bd1830f6f359',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Returns the product with the specified ID.',
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Bad Request - Invalid ObjectId format.',
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Not Found - Product does not exist.',
//   })
//   findOne(@Param('id', ParseObjectIdPipe) id: string) {
//     return this.productsService.findOne(id);
//   }

//   @Patch(':id')
//   @ApiOperation({ summary: 'Update a product' })
//   @ApiParam({
//     name: 'id',
//     description: 'MongoDB ObjectId of the product',
//     example: '6941c9ca06b8bd1830f6f359',
//   })
//   @ApiBody({ type: UpdateProductDto })
//   @ApiResponse({
//     status: 200,
//     description: 'The product has been successfully updated.',
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Bad Request - Invalid data or ObjectId.',
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Not Found - Product does not exist.',
//   })
//   update(
//     @Param('id', ParseObjectIdPipe) id: string,
//     @Body() updateProductDto: UpdateProductDto,
//   ) {
//     return this.productsService.update(id, updateProductDto);
//   }

//   @Patch(':id/stock')
//   @ApiOperation({ summary: 'Update product stock quantity' })
//   @ApiParam({
//     name: 'id',
//     description: 'MongoDB ObjectId of the product',
//     example: '6941c9ca06b8bd1830f6f359',
//   })
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         quantity: {
//           type: 'number',
//           example: 20,
//           description: 'New stock quantity',
//         },
//       },
//     },
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Product stock has been successfully updated.',
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Not Found - Product does not exist.',
//   })
//   updateStock(
//     @Param('id', ParseObjectIdPipe) id: string,
//     @Body('quantity') quantity: number,
//   ) {
//     return this.productsService.updateStock(id, quantity);
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @ApiOperation({ summary: 'Delete a product' })
//   @ApiParam({
//     name: 'id',
//     description: 'MongoDB ObjectId of the product',
//     example: '6941c9ca06b8bd1830f6f359',
//   })
//   @ApiResponse({
//     status: 204,
//     description: 'The product has been successfully deleted.',
//   })
//   @ApiResponse({
//     status: 400,
//     description: 'Bad Request - Invalid ObjectId format.',
//   })
//   @ApiResponse({
//     status: 404,
//     description: 'Not Found - Product does not exist.',
//   })
//   remove(@Param('id', ParseObjectIdPipe) id: string) {
//     return this.productsService.remove(id);
//   }

//   @Get('debug/owners')
//   @ApiOperation({
//     summary: 'Debug endpoint to check owner field types',
//     description: 'Development endpoint to verify owner field storage',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Returns debug information about owner fields.',
//   })
//   debugOwners() {
//     return this.productsService.debugCheckOwners();
//   }

//   @Post('migrate/owners')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({
//     summary: 'Migrate owner fields from string to ObjectId',
//     description: 'Development/maintenance endpoint to fix legacy data',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Migration completed successfully.',
//     schema: {
//       example: {
//         success: true,
//         migrated: 4,
//         failed: 0,
//         message: 'Successfully migrated 4 products. Failed: 0',
//       },
//     },
//   })
//   migrateOwners() {
//     return this.productsService.migrateOwnersToObjectId();
//   }
// }

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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  ApiCreateOperation,
  ApiGetAllOperation,
  ApiGetOneOperation,
  ApiUpdateOperation,
  ApiDeleteOperation,
  ApiFilterByField,
  ApiPriceRangeQuery,
} from 'src/common/decorators/swagger.decorators';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateOperation('product', CreateProductDto)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiGetAllOperation('product')
  findAll() {
    return this.productsService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get all available products' })
  @ApiResponse({ status: 200, description: 'Returns available products.' })
  findAvailableProducts() {
    return this.productsService.findAvailableProducts();
  }

  @Get('category/:category')
  @ApiFilterByField('category', 'electronics')
  findByCategory(@Param('category') category: string) {
    return this.productsService.findByCategory(category);
  }

  @Get('price-range')
  @ApiPriceRangeQuery()
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
  @ApiFilterByField('ownerId', '6941c93806b8bd1830f6f353')
  findByOwner(@Param('ownerId') ownerId: string) {
    return this.productsService.findByOwner(ownerId);
  }

  @Get(':id')
  @ApiGetOneOperation('product')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdateOperation('product', UpdateProductDto)
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Update product stock quantity' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: { type: 'number', example: 20 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Stock updated successfully.' })
  updateStock(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(id, quantity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteOperation('product')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Get('debug/owners')
  @ApiOperation({
    summary: 'Debug endpoint to check owner field types',
    description: 'Development endpoint to verify owner field storage',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns debug information about owner fields.',
  })
  debugOwners() {
    return this.productsService.debugCheckOwners();
  }

  @Post('migrate/owners')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Migrate owner fields from string to ObjectId',
    description: 'Development/maintenance endpoint to fix legacy data',
  })
  @ApiResponse({
    status: 200,
    description: 'Migration completed successfully.',
    schema: {
      example: {
        success: true,
        migrated: 4,
        failed: 0,
        message: 'Successfully migrated 4 products. Failed: 0',
      },
    },
  })
  migrateOwners() {
    return this.productsService.migrateOwnersToObjectId();
  }
}
