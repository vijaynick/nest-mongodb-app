import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { UsersModule } from '../users/users.module'; // ← Import UsersModule
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UsersModule, // ← Add UsersModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService, CustomLoggerService],
  exports: [ProductsService],
})
export class ProductsModule {}
