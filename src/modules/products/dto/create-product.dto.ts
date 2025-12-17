import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Laptop',
    minLength: 1,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'High-performance laptop for developers',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 1299.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'The stock quantity of the product',
    example: 15,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({
    description: 'Whether the product is available for purchase',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Categories associated with the product',
    example: ['electronics', 'computers'],
    type: [String],
    default: [],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiProperty({
    description: 'MongoDB ObjectId of the user who owns this product',
    example: '6941c93806b8bd1830f6f353',
  })
  @IsMongoId()
  owner: string;
}
