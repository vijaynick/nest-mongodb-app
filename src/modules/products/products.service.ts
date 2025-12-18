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
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';
import { BaseService } from 'src/common/base/base.service';
import { LogBusinessEvent, LogMethod } from 'src/common/decorators';

@Injectable()
export class ProductsService extends BaseService {
  protected readonly serviceName = 'ProductsService';
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly usersService: UsersService, // ← Inject UsersService
    protected readonly logger: CustomLoggerService,
  ) {
    super();
  }

  /**
   * Create a new product with owner validation
   */
  @LogMethod()
  @LogBusinessEvent('Product Created')
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(createProductDto.owner)) {
      this.logWarn(`Invalid owner ID format: ${createProductDto.owner}`);
      throw new BadRequestException('Invalid owner ID format');
    }

    // Validate owner exists
    this.logDebug(`Validating owner: ${createProductDto.owner}`);
    try {
      await this.usersService.findOne(createProductDto.owner);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logWarn(`Owner not found: ${createProductDto.owner}`);
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
  @LogMethod()
  async findAll(): Promise<Product[]> {
    return this.executeQuery('Product.find().populate(owner)', async () => {
      const products = await this.productModel
        .find()
        .populate('owner', 'name email')
        .exec();
      this.logInfo(`Found ${products.length} products`);
      return products;
    });
  }

  /**
   * Find product by ID with owner details
   */
  @LogMethod()
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('owner', 'name email')
      .exec();

    if (!product) {
      this.logWarn(`Product not found: ${id}`);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Find products by owner
   */
  @LogMethod()
  async findByOwner(ownerId: string): Promise<Product[]> {
    if (!Types.ObjectId.isValid(ownerId)) {
      this.logWarn(`Invalid owner ID: ${ownerId}`);
      throw new BadRequestException('Invalid owner ID');
    }

    return this.executeQuery(`Product.find({owner:${ownerId}})`, async () => {
      const products = await this.productModel
        .find({
          $or: [
            { owner: new Types.ObjectId(ownerId) },
            { owner: ownerId } as any,
          ],
        })
        .populate('owner', 'name email')
        .exec();
      this.logInfo(`Found ${products.length} products for owner ${ownerId}`);
      return products;
    });
  }

  /**
   * Find available products
   */
  @LogMethod()
  async findAvailableProducts(): Promise<Product[]> {
    return this.executeQuery('Product.find({isAvailable:true})', async () => {
      const products = await this.productModel
        .find({ isAvailable: true, stock: { $gt: 0 } })
        .populate('owner', 'name email')
        .exec();
      this.logInfo(`Found ${products.length} available products`);
      return products;
    });
  }

  /**
   * Find products by category
   */
  @LogMethod()
  async findByCategory(category: string): Promise<Product[]> {
    return this.executeQuery(
      `Product.find({category:'${category}'})`,
      async () => {
        const products = await this.productModel
          .find({ categories: category })
          .populate('owner', 'name email')
          .exec();
        this.logInfo(
          `Found ${products.length} products in category '${category}'`,
        );
        return products;
      },
    );
  }

  /**
   * Find products within price range
   */
  @LogMethod()
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Product[]> {
    return this.executeQuery(
      `Product.find({price:${minPrice}-${maxPrice}})`,
      async () => {
        const products = await this.productModel
          .find({ price: { $gte: minPrice, $lte: maxPrice } })
          .populate('owner', 'name email')
          .exec();
        this.logInfo(
          `Found ${products.length} products in price range $${minPrice}-$${maxPrice}`,
        );
        return products;
      },
    );
  }

  /**
   * Update product by ID
   */
  @LogMethod()
  @LogBusinessEvent('Product Updated')
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('owner', 'name email')
      .exec();

    if (!updatedProduct) {
      this.logWarn(`Product not found for update: ${id}`);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return updatedProduct;
  }

  /**
   * Delete product by ID
   */
  @LogMethod()
  @LogBusinessEvent('Product Deleted')
  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();

    if (!result) {
      this.logWarn(`Product not found for deletion: ${id}`);
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  /**
   * Update stock quantity
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    return this.executeWithLogging(
      'updateStock',
      async () => {
        const product = await this.productModel.findById(id).exec();

        if (!product) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const oldStock = product.stock;
        product.stock = quantity;
        product.isAvailable = quantity > 0;

        const updated = await product.save();

        // Stock warnings
        if (quantity === 0) {
          this.logWarn(`⚠️  Out of stock: ${product.name} (ID: ${id})`);
        } else if (quantity > 0 && quantity <= 5) {
          this.logWarn(
            `⚠️  Low stock: ${product.name} has only ${quantity} units`,
          );
        }

        this.logEvent('Stock Updated', {
          productId: id,
          productName: product.name,
          oldStock,
          newStock: quantity,
          isAvailable: updated.isAvailable,
        });

        return updated;
      },
      { id, quantity },
    );
  }

  /**
   * MIGRATION: Convert owner strings to ObjectIds
   */
  async migrateOwnersToObjectId(): Promise<any> {
    return this.executeWithLogging('migrateOwners', async () => {
      const products = await this.productModel.find().exec();
      this.logInfo(`Starting migration for ${products.length} products`);

      let migrated = 0;
      let skipped = 0;
      let failed = 0;

      for (const product of products) {
        try {
          if (typeof product.owner === 'string') {
            product.owner = new Types.ObjectId(product.owner) as any;
            await product.save();
            migrated++;
          } else {
            skipped++;
          }
        } catch (error) {
          failed++;
          this.logWarn(`Failed to migrate: ${product.name}`);
        }
      }

      const result = {
        success: true,
        total: products.length,
        migrated,
        skipped,
        failed,
        message: `Migrated ${migrated}, skipped ${skipped}, failed ${failed}`,
      };

      this.logEvent('Migration Complete', result);
      return result;
    });
  }
  /**
   * DEBUG: Check all products and their owner types
   */
  async debugCheckOwners(): Promise<any> {
    this.logDebug('Running owner type check');

    const products = await this.productModel.find().lean().exec();
    return products.map((p) => ({
      id: p._id,
      name: p.name,
      owner: p.owner,
      ownerType: typeof p.owner,
    }));
  }
}
