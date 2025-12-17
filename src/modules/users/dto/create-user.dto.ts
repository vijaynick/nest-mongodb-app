/*
 * Approach 1: Original (Most Verbose)
 */
// import {
//   IsString,
//   IsEmail,
//   IsInt,
//   Min,
//   Max,
//   IsOptional,
//   IsBoolean,
//   IsArray,
// } from 'class-validator';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// export class CreateUserDto {
//   @ApiProperty({ example: 'John Doe' })
//   @IsString()
//   @IsOptional()
//   name: string;

//   @ApiProperty({ example: 'john.doe@example.com' })
//   @IsEmail()
//   email: string;

//   @ApiProperty({
//     description: 'The age of the user',
//     example: 30,
//     minimum: 0,
//     maximum: 150,
//   })
//   @IsInt()
//   @Min(0)
//   @Max(150)
//   age: number;

//   @ApiPropertyOptional({
//     description: 'Whether the user is active',
//     example: true,
//     default: true,
//   })
//   @IsBoolean()
//   @IsOptional()
//   isActive?: boolean;

//   @ApiPropertyOptional({
//     description: 'Tags associated with the user',
//     example: ['developer', 'nodejs'],
//     type: [String],
//     default: [],
//   })
//   @IsArray()
//   @IsString({ each: true })
//   @IsOptional()
//   tags?: string[];
// }

/*
 * Approach 2: Simple Reusable (Less Flexible)
 */

// import {
//   IsString,
//   IsEmail,
//   IsInt,
//   Min,
//   Max,
//   IsOptional,
//   IsBoolean,
//   IsArray,
// } from 'class-validator';
// import {
//   ApiEmail,
//   ApiName,
//   ApiTags,
//   ApiIsActive,
// } from '../../../common/dto/base-dto.decorators';
// import { ApiProperty } from '@nestjs/swagger';

// export class CreateUserDto {
//   @ApiName() // ← Reusable decorator
//   @IsString()
//   name: string;

//   @ApiEmail() // ← Reusable decorator
//   @IsEmail()
//   email: string;

//   @ApiProperty({ example: 30, minimum: 0, maximum: 150 })
//   @IsInt()
//   @Min(0)
//   @Max(150)
//   age: number;

//   @ApiIsActive() // ← Reusable decorator
//   @IsBoolean()
//   @IsOptional()
//   isActive?: boolean;

//   @ApiTags() // ← Reusable decorator
//   @IsArray()
//   @IsString({ each: true })
//   @IsOptional()
//   tags?: string[];
// }

/*
 * Better Approach: Make Decorators More Flexible
 * Approach 3: Flexible Reusable (Best)
 */
import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import {
  ApiEmail,
  ApiName,
  ApiInteger,
  ApiBoolean,
  ApiStringArray,
} from '../../../common/dto/base-dto.decorators';

export class CreateUserDto {
  @ApiName('Full name of the user', 'John Doe')
  @IsString()
  name: string;

  @ApiEmail('User email address')
  @IsEmail()
  email: string;

  @ApiInteger('Age of the user', 30, 0, 150)
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @ApiBoolean('Whether the user is active', true, true)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiStringArray('Tags associated with the user', ['developer', 'nodejs'])
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
