import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto';
import { CustomLoggerService } from '../../common/logger/custom-logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log(
        `Creating user with email: ${createUserDto.email}`,
        'UsersService',
      );

      const createdUser = new this.userModel(createUserDto);
      const savedUser = await createdUser.save();

      this.logger.logBusinessEvent(
        'User Created',
        {
          userId: savedUser._id,
          email: savedUser.email,
        },
        'UsersService',
      );
      return savedUser;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        this.logger.warn(
          `Duplicate email attempt: ${createUserDto.email}`,
          'UsersService',
        );
        throw new ConflictException('Email already exists');
      }
      this.logger.error(
        `Failed to create user: ${error.message}`,
        error.stack,
        'UsersService',
      );
      throw error;
    }
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    this.logger.debug('Fetching all users', 'UsersService');
    const users = await this.userModel.find().exec();
    this.logger.log(`Found ${users.length} users`, 'UsersService');
    return users;
  }

  /**
   * Find user by ID
   */
  async findOne(id: string): Promise<User> {
    this.logger.debug(`Fetching user by ID: ${id}`, 'UsersService');

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      this.logger.warn(`User not found: ${id}`, 'UsersService');
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`Fetching user by email: ${email}`, 'UsersService');
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Update user by ID
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      this.logger.log(`Updating user: ${id}`, 'UsersService');

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!updatedUser) {
        this.logger.warn(`User not found for update: ${id}`, 'UsersService');
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      this.logger.logBusinessEvent(
        'User Updated',
        {
          userId: id,
          updatedFields: Object.keys(updateUserDto),
        },
        'UsersService',
      );

      return updatedUser;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        this.logger.warn(
          `Duplicate email in update: ${updateUserDto.email}`,
          'UsersService',
        );
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Delete user by ID
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting user: ${id}`, 'UsersService');

    const result = await this.userModel.findByIdAndDelete(id).exec();

    if (!result) {
      this.logger.warn(`User not found for deletion: ${id}`, 'UsersService');
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.logger.logBusinessEvent(
      'User Deleted',
      { userId: id, email: result.email },
      'UsersService',
    );
  }

  /**
   * Find active users
   */
  async findActiveUsers(): Promise<User[]> {
    this.logger.debug('Fetching active users', 'UsersService');
    const users = await this.userModel.find({ isActive: true }).exec();
    this.logger.log(`Found ${users.length} active users`, 'UsersService');
    return users;
  }
}
