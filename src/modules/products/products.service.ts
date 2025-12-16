import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto';
import { UsersService } from '../users/users.service'; // ← Import UsersService

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly usersService: UsersService, // ← Inject UsersService
  ) {}

  /**
   * Create a new product with owner validation
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(createProductDto.owner)) {
      throw new BadRequestException('Invalid owner ID format');
    }

    // Validate that the owner (user) exists
    try {
      await this.usersService.findOne(createProductDto.owner);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(
          `Owner with ID ${createProductDto.owner} does not exist`,
        );
      }
      throw error;
    }

    const createdProduct = new this.productModel(createProductDto);
    return await createdProduct.save();
  }

  /**
   * Find all products with owner details
   */
  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('owner', 'name email').exec();
  }

  /**
   * Find product by ID with owner details
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('owner', 'name email')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Find products by owner
   */
  async findByOwner(ownerId: string): Promise<Product[]> {
    if (!Types.ObjectId.isValid(ownerId)) {
      throw new BadRequestException('Invalid owner ID');
    }

    // Search with $or to match both ObjectId and String (for legacy data)
    const products = await this.productModel
      .find({
        $or: [
          { owner: new Types.ObjectId(ownerId) },
          { owner: ownerId } as any,
        ],
      })
      .populate('owner', 'name email')
      .exec();

    return products;
  }

  /**
   * Find available products
   */
  async findAvailableProducts(): Promise<Product[]> {
    return this.productModel
      .find({ isAvailable: true, stock: { $gt: 0 } })
      .populate('owner', 'name email')
      .exec();
  }

  /**
   * Find products by category
   */
  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel
      .find({ categories: category })
      .populate('owner', 'name email')
      .exec();
  }

  /**
   * Find products within price range
   */
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Product[]> {
    return this.productModel
      .find({ price: { $gte: minPrice, $lte: maxPrice } })
      .populate('owner', 'name email')
      .exec();
  }

  /**
   * Update product by ID
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('owner', 'name email')
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return updatedProduct;
  }

  /**
   * Delete product by ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  /**
   * Update stock quantity
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.stock = quantity;
    product.isAvailable = quantity > 0;

    return await product.save();
  }

  /**
   * MIGRATION: Convert owner strings to ObjectIds
   */
  async migrateOwnersToObjectId(): Promise<any> {
    const products = await this.productModel.find().exec();

    let migrated = 0;
    let failed = 0;

    for (const product of products) {
      try {
        if (typeof product.owner === 'string') {
          console.log(`Migrating product: ${product.name}`);
          product.owner = new Types.ObjectId(product.owner) as any;
          await product.save();
          migrated++;
        }
      } catch (error) {
        console.error(`Failed to migrate product ${product.name}:`, error);
        failed++;
      }
    }

    return {
      success: true,
      migrated,
      failed,
      message: `Successfully migrated ${migrated} products. Failed: ${failed}`,
    };
  }

  /**
   * DEBUG: Check all products and their owner types
   */
  async debugCheckOwners(): Promise<any> {
    const allProducts = await this.productModel.find().lean().exec();

    return allProducts.map((p) => ({
      name: p.name,
      owner: p.owner,
      ownerType: typeof p.owner,
    }));
  }
}
