import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Omit owner from updates (can't change owner)
export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['owner'] as const),
) {
  @ApiPropertyOptional({
    description: 'The name of the product',
    example: 'Gaming Laptop',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'The description of the product',
    example: 'High-performance gaming laptop with RGB keyboard',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'The price of the product',
    example: 1499.99,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'The stock quantity of the product',
    example: 20,
  })
  stock?: number;

  @ApiPropertyOptional({
    description: 'Whether the product is available',
    example: true,
  })
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Categories associated with the product',
    example: ['electronics', 'gaming', 'computers'],
  })
  categories?: string[];
}
