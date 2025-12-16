import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ required: false, default: true })
  isAvailable: boolean;

  @Prop({ type: [String], default: [] })
  categories: string[];

  // IMPORTANT: Use MongooseSchema.Types.ObjectId for proper type enforcement
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ name: 1 });
ProductSchema.index({ owner: 1 });
ProductSchema.index({ isAvailable: 1 });
ProductSchema.index({ price: 1 });
