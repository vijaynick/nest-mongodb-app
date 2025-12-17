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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ParseObjectIdPipe } from '../../common/pipes/parse-objectid.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: {
        _id: '6941c93806b8bd1830f6f353',
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
        isActive: true,
        tags: ['developer', 'nodejs'],
        createdAt: '2025-12-16T10:00:00.000Z',
        updatedAt: '2025-12-16T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already exists.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of all users.',
    schema: {
      example: [
        {
          _id: '6941c93806b8bd1830f6f353',
          name: 'John Doe',
          email: 'john.doe@example.com',
          age: 30,
          isActive: true,
          tags: ['developer'],
          createdAt: '2025-12-16T10:00:00.000Z',
          updatedAt: '2025-12-16T10:00:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active users' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of active users only.',
  })
  findActiveUsers() {
    return this.usersService.findActiveUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the user',
    example: '6941c93806b8bd1830f6f353',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified ID.',
    schema: {
      example: {
        _id: '6941c93806b8bd1830f6f353',
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
        isActive: true,
        tags: ['developer'],
        createdAt: '2025-12-16T10:00:00.000Z',
        updatedAt: '2025-12-16T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ObjectId format.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - User does not exist.',
  })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the user',
    example: '6941c93806b8bd1830f6f353',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data or ObjectId.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - User does not exist.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already exists.',
  })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the user',
    example: '6941c93806b8bd1830f6f353',
  })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ObjectId format.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - User does not exist.',
  })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
