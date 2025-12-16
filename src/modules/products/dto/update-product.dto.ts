import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Omit owner from updates (can't change owner)
export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['owner'] as const),
) {}
