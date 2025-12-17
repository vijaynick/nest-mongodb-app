import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'The name of the user',
    example: 'John Updated',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'The email address of the user',
    example: 'john.updated@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'The age of the user',
    example: 31,
  })
  age?: number;

  @ApiPropertyOptional({
    description: 'Whether the user is active',
    example: false,
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Tags associated with the user',
    example: ['developer', 'nodejs', 'nestjs'],
  })
  tags?: string[];
}
