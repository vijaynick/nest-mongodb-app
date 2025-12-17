/*
 * Approach 1: Original (Most Verbose)
 */
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsString,
//   IsNumber,
//   Min,
//   IsOptional,
//   IsBoolean,
//   IsArray,
//   IsMongoId,
// } from 'class-validator';

// export class CreateProductDto {
//   @ApiProperty({
//     description: 'The name of the product',
//     example: 'Laptop',
//     minLength: 1,
//   })
//   @IsString()
//   name: string;

//   @ApiProperty({
//     description: 'The description of the product',
//     example: 'High-performance laptop for developers',
//   })
//   @IsString()
//   description: string;

//   @ApiProperty({
//     description: 'The price of the product',
//     example: 1299.99,
//     minimum: 0,
//   })
//   @IsNumber()
//   @Min(0)
//   price: number;

//   @ApiPropertyOptional({
//     description: 'The stock quantity of the product',
//     example: 15,
//     minimum: 0,
//     default: 0,
//   })
//   @IsNumber()
//   @Min(0)
//   @IsOptional()
//   stock?: number;

//   @ApiPropertyOptional({
//     description: 'Whether the product is available for purchase',
//     example: true,
//     default: true,
//   })
//   @IsBoolean()
//   @IsOptional()
//   isAvailable?: boolean;

//   @ApiPropertyOptional({
//     description: 'Categories associated with the product',
//     example: ['electronics', 'computers'],
//     type: [String],
//     default: [],
//   })
//   @IsArray()
//   @IsString({ each: true })
//   @IsOptional()
//   categories?: string[];

//   @ApiProperty({
//     description: 'MongoDB ObjectId of the user who owns this product',
//     example: '6941c93806b8bd1830f6f353',
//   })
//   @IsMongoId()
//   owner: string;
// }

/*
 * Approach 2: Simple Reusable (Less Flexible)
 */

// import {
//   IsString,
//   IsNumber,
//   Min,
//   IsOptional,
//   IsBoolean,
//   IsArray,
//   IsMongoId,
// } from 'class-validator';
// import {
//   ApiName,
//   ApiDescription,
//   ApiPrice,
//   ApiStock,
//   ApiCategories,
//   ApiIsActive,
//   ApiMongoId,
// } from '../../../common/dto/base-dto.decorators';

// export class CreateProductDto {
//   @ApiName() // ← Reusable
//   @IsString()
//   name: string;

//   @ApiDescription() // ← Reusable
//   @IsString()
//   description: string;

//   @ApiPrice() // ← Reusable
//   @IsNumber()
//   @Min(0)
//   price: number;

//   @ApiStock() // ← Reusable
//   @IsNumber()
//   @Min(0)
//   @IsOptional()
//   stock?: number;

//   @ApiIsActive() // ← Reusable (but rename the description)
//   @IsBoolean()
//   @IsOptional()
//   isAvailable?: boolean;

//   @ApiCategories() // ← Reusable
//   @IsArray()
//   @IsString({ each: true })
//   @IsOptional()
//   categories?: string[];

//   @ApiMongoId() // ← Reusable
//   @IsMongoId()
//   owner: string;
// }

/*
 * Better Approach: Make Decorators More Flexible
 * Approach 3: Flexible Reusable (Best)
 */
import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
  IsArray,
  IsMongoId,
} from 'class-validator';
import {
  ApiName,
  ApiDescription,
  ApiPrice,
  ApiStock,
  ApiBoolean,
  ApiStringArray,
  ApiMongoId,
} from '../../../common/dto/base-dto.decorators';

export class CreateProductDto {
  @ApiName('Product name', 'Gaming Laptop')
  @IsString()
  name: string;

  @ApiDescription(
    'Product description',
    'High-performance gaming laptop with RGB keyboard',
  )
  @IsString()
  description: string;

  @ApiPrice('Product price', 1299.99)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiStock('Available stock quantity', 15)
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiBoolean('Whether the product is available for purchase', true, true)
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiStringArray('Product categories', ['electronics', 'computers', 'gaming'])
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiMongoId('Owner user ID')
  @IsMongoId()
  owner: string;
}
