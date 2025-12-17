import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

// Generic CRUD Operation Decorators
/*
Benefits of This Approach
✅ DRY - No repetition
✅ Reusable - Use across all modules
✅ Maintainable - Change once, apply everywhere
✅ Consistent - Same documentation style
✅ Scalable - Easy to add new modules
✅ Clean Code - Controllers are readable
*/
export const ApiCreateOperation = (resource: string, dtoClass: Type<any>) => {
  return applyDecorators(
    ApiOperation({ summary: `Create a new ${resource}` }),
    ApiBody({ type: dtoClass }),
    ApiResponse({
      status: 201,
      description: `The ${resource} has been successfully created.`,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed.',
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Resource already exists.',
    }),
  );
};

export const ApiGetAllOperation = (resource: string) => {
  return applyDecorators(
    ApiOperation({ summary: `Get all ${resource}s` }),
    ApiResponse({
      status: 200,
      description: `Returns an array of all ${resource}s.`,
    }),
  );
};

export const ApiGetOneOperation = (resource: string) => {
  return applyDecorators(
    ApiOperation({ summary: `Get a ${resource} by ID` }),
    ApiParam({
      name: 'id',
      description: `MongoDB ObjectId of the ${resource}`,
      example: '6941c93806b8bd1830f6f353',
    }),
    ApiResponse({
      status: 200,
      description: `Returns the ${resource} with the specified ID.`,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid ObjectId format.',
    }),
    ApiResponse({
      status: 404,
      description: `Not Found - ${resource} does not exist.`,
    }),
  );
};

export const ApiUpdateOperation = (resource: string, dtoClass: Type<any>) => {
  return applyDecorators(
    ApiOperation({ summary: `Update a ${resource}` }),
    ApiParam({
      name: 'id',
      description: `MongoDB ObjectId of the ${resource}`,
      example: '6941c93806b8bd1830f6f353',
    }),
    ApiBody({ type: dtoClass }),
    ApiResponse({
      status: 200,
      description: `The ${resource} has been successfully updated.`,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid data or ObjectId.',
    }),
    ApiResponse({
      status: 404,
      description: `Not Found - ${resource} does not exist.`,
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Duplicate value.',
    }),
  );
};

export const ApiDeleteOperation = (resource: string) => {
  return applyDecorators(
    ApiOperation({ summary: `Delete a ${resource}` }),
    ApiParam({
      name: 'id',
      description: `MongoDB ObjectId of the ${resource}`,
      example: '6941c93806b8bd1830f6f353',
    }),
    ApiResponse({
      status: 204,
      description: `The ${resource} has been successfully deleted.`,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid ObjectId format.',
    }),
    ApiResponse({
      status: 404,
      description: `Not Found - ${resource} does not exist.`,
    }),
  );
};

// Custom Query Decorators
export const ApiFilterByField = (field: string, example: string) => {
  return applyDecorators(
    ApiOperation({ summary: `Get items by ${field}` }),
    ApiParam({
      name: field,
      description: `Filter by ${field}`,
      example,
    }),
    ApiResponse({
      status: 200,
      description: `Returns items filtered by ${field}.`,
    }),
  );
};

export const ApiPriceRangeQuery = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get products within a price range' }),
    ApiQuery({
      name: 'min',
      description: 'Minimum price',
      example: 0,
      required: true,
    }),
    ApiQuery({
      name: 'max',
      description: 'Maximum price',
      example: 1000,
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Returns products within the specified price range.',
    }),
  );
};

// Pagination
export const ApiPaginationQuery = () => {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, example: 1 }),
    ApiQuery({ name: 'limit', required: false, example: 10 }),
  );
};

// Sorting
export const ApiSortQuery = () => {
  return applyDecorators(
    ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' }),
    ApiQuery({ name: 'order', required: false, example: 'desc' }),
  );
};

// Search
export const ApiSearchQuery = () => {
  return applyDecorators(
    ApiQuery({ name: 'search', required: false, example: 'laptop' }),
  );
};
