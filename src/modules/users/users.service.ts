import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto';
import { BaseService } from 'src/common/base/base.service';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';
import { LogBusinessEvent, LogMethod } from 'src/common/decorators';

@Injectable()
export class UsersService extends BaseService {
  protected readonly serviceName = 'UsersService';

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    protected readonly logger: CustomLoggerService,
  ) {
    super();
  }

  /**
   * Create a new user
   */
  @LogMethod()
  @LogBusinessEvent('User Created')
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        this.logWarn(`Duplicate email attempt: ${createUserDto.email}`);
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Find all users
   */
  @LogMethod()
  async findAll(): Promise<User[]> {
    return this.executeQuery('User.find()', async () => {
      const users = await this.userModel.find().exec();
      this.logInfo(`Found ${users.length} users`);
      return users;
    });
  }

  /**
   * Find user by ID
   */
  @LogMethod()
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      this.logWarn(`User not found: ${id}`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    this.logDebug(`Finding user by email: ${email}`);
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Update user by ID
   */
  @LogMethod()
  @LogBusinessEvent('User Updated')
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!updatedUser) {
        this.logWarn(`User not found for update: ${id}`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        this.logWarn(`Duplicate email in update: ${updateUserDto.email}`);
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Delete user by ID
   */
  @LogMethod()
  @LogBusinessEvent('User Deleted')
  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();

    if (!result) {
      this.logWarn(`User not found for deletion: ${id}`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Find active users
   */
  @LogMethod()
  async findActiveUsers(): Promise<User[]> {
    return this.executeQuery('User.find({isActive:true})', async () => {
      const users = await this.userModel.find({ isActive: true }).exec();
      this.logInfo(`Found ${users.length} active users`);
      return users;
    });
  }
}
