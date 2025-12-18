import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/logger.config';
import { CustomLoggerService } from './common/logger/custom-logger.service';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';

@Module({
  imports: [
    // Winston Logger Module
    WinstonModule.forRoot(winstonConfig),

    // Configuration Module - loads .env file
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app
      load: [databaseConfig], // Load our database configuration
      envFilePath: '.env',
    }),
    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        dbName: configService.get<string>('database.name'),
      }),
      inject: [ConfigService],
    }),
    UsersModule, // Add Users Module
    ProductsModule, // Add Products Module
  ],
  controllers: [],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply HTTP logger middleware to all routes
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
