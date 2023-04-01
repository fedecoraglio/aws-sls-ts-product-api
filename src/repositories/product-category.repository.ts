import { DocumentClient, WriteRequest } from 'aws-sdk/clients/dynamodb';

import { ProductModel } from '@models/product.model';
import { BaseModel } from '@models/base.model';
import { ProductCategoryDto } from '@dtos/product.dtos';
import dynamoDBClient from '../dbconnect';
import { ProductCategoryBuilder } from '@builders/product-category.builder';

export class ProductCategoryRepository {
  private static instance: ProductCategoryRepository;
  private readonly builder = ProductCategoryBuilder.instance;
  private constructor(private readonly docClient: DocumentClient) {}

  static getInstance() {
    if (!ProductCategoryRepository.instance) {
      ProductCategoryRepository.instance = new ProductCategoryRepository(
        dynamoDBClient(),
      );
    }
    return ProductCategoryRepository.instance;
  }

  async create(
    categoryId: string,
    dto: ProductCategoryDto[],
  ): Promise<boolean> {
    try {
      return await this.batchPutProduct(categoryId, dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async delete(
    categoryId: string,
    dto: ProductCategoryDto[],
  ): Promise<boolean> {
    try {
      return await this.batchDeleteProduct(categoryId, dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async batchDeleteProduct(
    categoryId: string,
    dtos: ProductCategoryDto[],
  ): Promise<boolean> {
    try {
      await this.docClient
        .batchWrite({
          RequestItems: {
            [BaseModel.TABLE_NAME]: await this.createDeleteProductRequest(
              categoryId,
              dtos,
            ),
          },
        })
        .promise();
      return true;
    } catch (err) {
      console.error('ProductCategoryRespository', err);
      throw err;
    }
  }

  private async batchPutProduct(
    categoryId: string,
    dtos: ProductCategoryDto[],
  ): Promise<boolean> {
    try {
      const data = {
        RequestItems: {
          products: await this.createPutProductRequest(categoryId, dtos),
        },
      };
      await this.docClient.batchWrite(data).promise();
      return true;
    } catch (err) {
      console.error('ProductCategoryRespository', err);
      throw err;
    }
  }

  private async createDeleteProductRequest(
    categoryId: string,
    dtos: ProductCategoryDto[],
  ): Promise<WriteRequest[]> {
    const writeRequest: WriteRequest[] = [];
    const prodKeys = [];

    this.builder.transformDtosToModels(dtos).forEach((model) => {
      if (model) {
        writeRequest.push({
          PutRequest: {
            Item: model.toItem(),
          },
        });
        prodKeys.push({ pk: model.productId, sk: model.productId });
      }
    });
    const currentProdResp = await this.docClient
      .batchGet({
        RequestItems: {
          [BaseModel.TABLE_NAME]: {
            Keys: prodKeys,
          },
        },
      })
      .promise();
    currentProdResp?.Responses[BaseModel.TABLE_NAME].forEach((item) => {
      const categories = item.categoryIds.filter(
        (catId: string) => catId !== categoryId,
      );
      item.categoryIds = categories;
      writeRequest.push(new ProductModel(item).toItem());
    });
    return writeRequest;
  }

  private async createPutProductRequest(
    categoryId: string,
    dtos: ProductCategoryDto[],
  ): Promise<WriteRequest[]> {
    const writeRequest: WriteRequest[] = [];
    const prodKeys = [];
    this.builder.transformDtosToModels(dtos).forEach((model) => {
      writeRequest.push({
        PutRequest: {
          Item: model.toItem(),
        },
      });
      prodKeys.push(new ProductModel({ productId: model.productId }).keys());
    });

    const currentProdResp = await this.docClient
      .batchGet({
        RequestItems: {
          [BaseModel.TABLE_NAME]: {
            Keys: prodKeys,
          },
        },
      })
      .promise();

    currentProdResp?.Responses[BaseModel.TABLE_NAME].forEach((item) => {
      const categories = item.categoryIds ?? [];
      const idx = item.categoryIds.findIndex(
        (catId: string) => catId === categoryId,
      );
      if (idx === -1 || categories.length === 0) {
        categories.push(categoryId);
        item.categoryIds = categories;
        writeRequest.push({
          PutRequest: {
            Item: new ProductModel(item).toItem(),
          },
        });
      }
    });
    return writeRequest;
  }
}
