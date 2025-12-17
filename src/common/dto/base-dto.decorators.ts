/*
 * Approach 2: Simple Reusable (Less Flexible)
 * Reusable decorator functions
 */

// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// export const ApiMongoId = () =>
//   ApiProperty({
//     description: 'MongoDB ObjectId',
//     example: '6941c93806b8bd1830f6f353',
//   });

// export const ApiEmail = () =>
//   ApiProperty({
//     description: 'Email address',
//     example: 'user@example.com',
//     format: 'email',
//   });

// export const ApiName = () =>
//   ApiProperty({
//     description: 'Name',
//     example: 'John Doe',
//   });

// export const ApiDescription = () =>
//   ApiProperty({
//     description: 'Description',
//     example: 'A detailed description',
//   });

// export const ApiPrice = () =>
//   ApiProperty({
//     description: 'Price',
//     example: 99.99,
//     minimum: 0,
//   });

// export const ApiStock = () =>
//   ApiPropertyOptional({
//     description: 'Stock quantity',
//     example: 10,
//     minimum: 0,
//     default: 0,
//   });

// export const ApiTags = () =>
//   ApiPropertyOptional({
//     description: 'Tags',
//     example: ['tag1', 'tag2'],
//     type: [String],
//     default: [],
//   });

// export const ApiCategories = () =>
//   ApiPropertyOptional({
//     description: 'Categories',
//     example: ['electronics', 'computers'],
//     type: [String],
//     default: [],
//   });

// export const ApiIsActive = () =>
//   ApiPropertyOptional({
//     description: 'Whether the item is active',
//     example: true,
//     default: true,
//   });

/*
 * Better Approach: Make Decorators More Flexible
 * Approach 3: Flexible Reusable (Best)
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Flexible decorators with optional overrides

export const ApiMongoId = (description = 'MongoDB ObjectId') =>
  ApiProperty({
    description,
    example: '6941c93806b8bd1830f6f353',
  });

export const ApiEmail = (description = 'Email address') =>
  ApiProperty({
    description,
    example: 'user@example.com',
    format: 'email',
  });

export const ApiName = (description = 'Name', example = 'John Doe') =>
  ApiProperty({
    description,
    example,
  });

export const ApiDescription = (
  description = 'Description',
  example = 'A detailed description',
) =>
  ApiProperty({
    description,
    example,
  });

export const ApiPrice = (description = 'Price', example = 99.99) =>
  ApiProperty({
    description,
    example,
    minimum: 0,
  });

export const ApiStock = (description = 'Stock quantity', example = 10) =>
  ApiPropertyOptional({
    description,
    example,
    minimum: 0,
    default: 0,
  });

export const ApiStringArray = (description: string, example: string[]) =>
  ApiPropertyOptional({
    description,
    example,
    type: [String],
    default: [],
  });

export const ApiBoolean = (
  description: string,
  example = true,
  defaultValue = true,
) =>
  ApiPropertyOptional({
    description,
    example,
    default: defaultValue,
  });

export const ApiInteger = (
  description: string,
  example: number,
  min?: number,
  max?: number,
) =>
  ApiProperty({
    description,
    example,
    minimum: min,
    maximum: max,
  });
