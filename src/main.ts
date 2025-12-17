import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  // Enable CORS if needed
  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS MongoDB API')
    .setDescription(
      'Complete API documentation for Users and Products management',
    )
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('products', 'Product management endpoints')
    .addServer('http://localhost:3000', 'Local development server')
    .addServer('https://api.production.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'NestJS MongoDB API Docs',
    customfavIcon: 'https://nestjs.com/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
