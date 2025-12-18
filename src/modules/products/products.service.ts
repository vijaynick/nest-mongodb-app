import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto';
import { UsersService } from '../users/users.service';
import { CustomLoggerService } from '../../common/logger/custom-logger.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly usersService: UsersService,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Create a new product with owner validation
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      this.logger.log(
        `Attempting to create product: ${createProductDto.name}`,
        'ProductsService',
      );

      // Validate ObjectId format
      if (!Types.ObjectId.isValid(createProductDto.owner)) {
        this.logger.warn(
          `Invalid owner ID format: ${createProductDto.owner}`,
          'ProductsService',
        );
        throw new BadRequestException('Invalid owner ID format');
      }

      // Validate owner exists
      this.logger.debug(
        `Validating owner existence: ${createProductDto.owner}`,
        'ProductsService',
      );

      try {
        await this.usersService.findOne(createProductDto.owner);
        this.logger.debug('Owner validation successful', 'ProductsService');
      } catch (error) {
        if (error instanceof NotFoundException) {
          this.logger.warn(
            `Owner not found: ${createProductDto.owner}`,
            'ProductsService',
          );
          throw new BadRequestException(
            `Owner with ID ${createProductDto.owner} does not exist`,
          );
        }
        throw error;
      }

      const createdProduct = new this.productModel(createProductDto);
      const savedProduct = await createdProduct.save();

      this.logger.logBusinessEvent(
        'Product Created',
        {
          productId: savedProduct._id,
          productName: savedProduct.name,
          price: savedProduct.price,
          stock: savedProduct.stock,
          owner: savedProduct.owner,
        },
        'ProductsService',
      );

      this.logger.log(
        `Product created successfully: ${savedProduct._id}`,
        'ProductsService',
      );

      return savedProduct;
    } catch (error) {
      this.logger.error(
        `Failed to create product: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * Find all products with owner details
   */
  async findAll(): Promise<Product[]> {
    try {
      this.logger.debug('Fetching all products', 'ProductsService');

      const startTime = Date.now();
      const products = await this.productModel
        .find()
        .populate('owner', 'name email')
        .exec();
      const duration = Date.now() - startTime;

      this.logger.logDatabaseQuery(
        'Product.find().populate(owner)',
        duration,
        'ProductsService',
      );

      this.logger.log(
        `Found ${products.length} products in ${duration}ms`,
        'ProductsService',
      );

      return products;
    } catch (error) {
      this.logger.error(
        `Failed to fetch all products: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * Find product by ID with owner details
   */
  async findOne(id: string): Promise<Product> {
    try {
      this.logger.debug(`Fetching product by ID: ${id}`, 'ProductsService');

      const startTime = Date.now();
      const product = await this.productModel
        .findById(id)
        .populate('owner', 'name email')
        .exec();
      const duration = Date.now() - startTime;

      this.logger.logDatabaseQuery(
        `Product.findById(${id}).populate(owner)`,
        duration,
        'ProductsService',
      );

      if (!product) {
        this.logger.warn(`Product not found: ${id}`, 'ProductsService');
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      this.logger.debug(`Product found: ${product.name}`, 'ProductsService');

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch product ${id}: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * Find products by owner
   */
  async findByOwner(ownerId: string): Promise<Product[]> {
    try {
      this.logger.debug(
        `Fetching products by owner: ${ownerId}`,
        'ProductsService',
      );

      if (!Types.ObjectId.isValid(ownerId)) {
        this.logger.warn(
          `Invalid owner ID format: ${ownerId}`,
          'ProductsService',
        );
        throw new BadRequestException('Invalid owner ID');
      }

      const startTime = Date.now();
      const products = await this.productModel
        .find({
          $or: [
            { owner: new Types.ObjectId(ownerId) },
            { owner: ownerId } as any,
          ],
        })
        .populate('owner', 'name email')
        .exec();
      const duration = Date.now() - startTime;

      this.logger.logDatabaseQuery(
        `Product.find({owner: ${ownerId}}).populate(owner)`,
        duration,
        'ProductsService',
      );

      this.logger.log(
        `Found ${products.length} products for owner ${ownerId}`,
        'ProductsService',
      );

      return products;
    } catch (error) {
      this.logger.error(
        `Failed to fetch products by owner ${ownerId}: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * Find available products
   */
  async findAvailableProducts(): Promise<Product[]> {
    try {
      this.logger.debug('Fetching available products', 'ProductsService');

      const startTime = Date.now();
      const products = await this.productModel
        .find({ isAvailable: true, stock: { $gt: 0 } })
        .populate('owner', 'name email')
        .exec();
      const duration = Date.now() - startTime;

      this.logger.logDatabaseQuery(
        'Product.find({isAvailable: true, stock: {$gt: 0}})',
        duration,
        'ProductsService',
      );

      this.logger.log(
        `Found ${products.length} available products`,
        'ProductsService',
      );

      return products;
    } catch (error) {
      this.logger.error(
        `Failed to fetch available products: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * Find products by category
   */
  async findByCategory(category: string): Promise<Product[]> {
    try {
      this.logger.debug(
        `Fetching products by category: ${category}`,
        'ProductsService',
      );

      const startTime = Date.now();
      const products = await this.productModel
        .find({ categories: category })
        .populate('owner', 'name email')
        .exec();
      const duration = Date.now() - startTime;

      this.logger.logDatabaseQuery(
        `Product.find({categories: '${category}'})`,
        duration,
        'ProductsService',
      );

      this.logger.log(
        `Found ${products.length} products in category '${category}'`,
        'ProductsService',
      );

      return products;
    } catch (error) {
      this.logger.error(
        `Failed to fetch products by category ${category}: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * Find products within price range
   */
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Product[]> {
    try {
      this.logger.debug(
        `Fetching products in price range: $${minPrice} - $${maxPrice}`,
        'ProductsService',
      );

      const startTime = Date.now();
      const products = await this.productModel
        .find({ price: { $gte: minPrice, $lte: maxPrice } })
        .populate('owner', 'name email')
        .exec();
      const duration = Date.now() - startTime;

      this.logger.logDatabaseQuery(
        `Product.find({price: {$gte: ${minPrice}, $lte: ${maxPrice}}})`,
        duration,
        'ProductsService',
      );

      this.logger.log(
        `Found ${products.length} products in price range $${minPrice}-$${maxPrice}`,
        'ProductsService',
      );

      return products;
    } catch (error) {
      this.logger.error(
        `Failed to fetch products by price range: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * Update product by ID
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      this.logger.log(`Updating product: ${id}`, 'ProductsService');
      this.logger.debug(
        `Update data: ${JSON.stringify(updateProductDto)}`,
        'ProductsService',
      );

      const startTime = Date.now();
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateProductDto, { new: true })
        .populate('owner', 'name email')
        .exec();
      const duration = Date.now() - startTime;

      this.logger.logDatabaseQuery(
        `Product.findByIdAndUpdate(${id})`,
        duration,
        'ProductsService',
      );

      if (!updatedProduct) {
        this.logger.warn(
          `Product not found for update: ${id}`,
          'ProductsService',
        );
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      this.logger.logBusinessEvent(
        'Product Updated',
        {
          productId: id,
          productName: updatedProduct.name,
          updatedFields: Object.keys(updateProductDto),
        },
        'ProductsService',
      );

      this.logger.log(`Product updated successfully: ${id}`, 'ProductsService');

      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update product ${id}: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * Delete product by ID
   */
  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting product: ${id}`, 'ProductsService');

      const startTime = Date.now();
      const result = await this.productModel.findByIdAndDelete(id).exec();
      const duration = Date.now() - startTime;

      this.logger.logDatabaseQuery(
        `Product.findByIdAndDelete(${id})`,
        duration,
        'ProductsService',
      );

      if (!result) {
        this.logger.warn(
          `Product not found for deletion: ${id}`,
          'ProductsService',
        );
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      this.logger.logBusinessEvent(
        'Product Deleted',
        {
          productId: id,
          productName: result.name,
          price: result.price,
          owner: result.owner,
        },
        'ProductsService',
      );

      this.logger.log(
        `Product deleted successfully: ${id} (${result.name})`,
        'ProductsService',
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete product ${id}: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * Update stock quantity
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    try {
      this.logger.log(
        `Updating stock for product ${id} to ${quantity} units`,
        'ProductsService',
      );

      const product = await this.productModel.findById(id).exec();

      if (!product) {
        this.logger.warn(`Product not found: ${id}`, 'ProductsService');
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      const oldStock = product.stock;
      const oldAvailability = product.isAvailable;

      product.stock = quantity;
      product.isAvailable = quantity > 0;

      const updated = await product.save();

      this.logger.logBusinessEvent(
        'Stock Updated',
        {
          productId: id,
          productName: product.name,
          oldStock,
          newStock: quantity,
          oldAvailability,
          newAvailability: updated.isAvailable,
        },
        'ProductsService',
      );

      // Stock level warnings
      if (quantity === 0) {
        this.logger.warn(
          `⚠️  Product out of stock: ${product.name} (ID: ${id})`,
          'ProductsService',
        );
      } else if (quantity > 0 && quantity <= 5) {
        this.logger.warn(
          `⚠️  Low stock alert: ${product.name} has only ${quantity} units left`,
          'ProductsService',
        );
      } else if (quantity > 100) {
        this.logger.log(
          `High stock level: ${product.name} has ${quantity} units`,
          'ProductsService',
        );
      }

      this.logger.log(
        `Stock updated successfully for ${product.name}: ${oldStock} → ${quantity}`,
        'ProductsService',
      );

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update stock for product ${id}: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * MIGRATION: Convert owner strings to ObjectIds
   */
  async migrateOwnersToObjectId(): Promise<any> {
    this.logger.log('Starting owner migration process', 'ProductsService');

    try {
      const products = await this.productModel.find().exec();
      this.logger.log(
        `Found ${products.length} products to check`,
        'ProductsService',
      );

      let migrated = 0;
      let skipped = 0;
      let failed = 0;

      for (const product of products) {
        try {
          if (typeof product.owner === 'string') {
            this.logger.debug(
              `Migrating product: ${product.name} (ID: ${product._id})`,
              'ProductsService',
            );

            product.owner = new Types.ObjectId(product.owner) as any;
            await product.save();
            migrated++;

            this.logger.debug(`✓ Migrated: ${product.name}`, 'ProductsService');
          } else {
            skipped++;
          }
        } catch (error) {
          failed++;
          this.logger.error(
            `Failed to migrate product ${product.name}: ${error.message}`,
            error.stack,
            'ProductsService',
          );
        }
      }

      const result = {
        success: true,
        total: products.length,
        migrated,
        skipped,
        failed,
        message: `Migration complete: ${migrated} migrated, ${skipped} skipped, ${failed} failed`,
      };

      this.logger.logBusinessEvent(
        'Owner Migration Completed',
        result,
        'ProductsService',
      );

      this.logger.log(result.message, 'ProductsService');

      return result;
    } catch (error) {
      this.logger.error(
        `Migration failed: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }

  /**
   * DEBUG: Check all products and their owner types
   */
  async debugCheckOwners(): Promise<any> {
    this.logger.debug('Running owner type debug check', 'ProductsService');

    try {
      const allProducts = await this.productModel.find().lean().exec();

      const results = allProducts.map((p) => ({
        id: p._id,
        name: p.name,
        owner: p.owner,
        ownerType: typeof p.owner,
      }));

      this.logger.debug(
        `Debug results: ${JSON.stringify(results, null, 2)}`,
        'ProductsService',
      );

      this.logger.log(
        `Debug check complete: ${results.length} products analyzed`,
        'ProductsService',
      );

      return results;
    } catch (error) {
      this.logger.error(
        `Debug check failed: ${error.message}`,
        error.stack,
        'ProductsService',
      );
      throw error;
    }
  }
}
