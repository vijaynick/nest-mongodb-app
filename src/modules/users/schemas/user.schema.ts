import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true, // Adds createdAt and updatedAt automatically
  versionKey: false, // Removes __v field
})
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, min: 0, max: 150 })
  age: number;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for better query performance

UserSchema.index({ email: 1 }, { unique: true }); // Add unique here instead
UserSchema.index({ isActive: 1 });
