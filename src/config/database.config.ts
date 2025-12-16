import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nest-mongodb-app',
  name: process.env.DATABASE_NAME || 'nest-mongodb-app',
}));
