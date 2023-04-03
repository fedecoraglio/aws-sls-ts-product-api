import {
  DocumentClient,
  ItemList,
  WriteRequest,
} from 'aws-sdk/clients/dynamodb';

import { ProductModel } from '@models/product.model';
import { BaseModel } from '@models/base.model';
import { ProductCategoryDto } from '@dtos/product.dtos';
import dynamoDBClient from '../dbconnect';
import { ProductCategoryBuilder } from '@builders/product-category.builder';
import { ProductCategoryModel } from '@models/product-category.model';

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
    const models = this.builder.transformDtosToModels(dtos);
    const productList = await this.getProductsByModels(models);
    productList.forEach((item: any) => {
      if (item.categoryIds?.length) {
        const categories = item.categoryIds.filter(
          (catId: string) => catId !== categoryId,
        );
        item.categoryIds = categories;
        writeRequest.push({
          DeleteRequest: {
            Key: new ProductModel(item).keys(),
          },
        });
      }
    });

    models.forEach((model) => {
      const productExits =
        productList.findIndex((p) => p.productId === model.productId) !== -1;
      if (model && productExits) {
        writeRequest.push({
          DeleteRequest: {
            Key: model.keys(),
          },
        });
      }
    });

    return writeRequest;
  }

  private async createPutProductRequest(
    categoryId: string,
    dtos: ProductCategoryDto[],
  ): Promise<WriteRequest[]> {
    const writeRequest: WriteRequest[] = [];
    const models = this.builder.transformDtosToModels(dtos);
    const productList = await this.getProductsByModels(models);
    productList.forEach((item: any) => {
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

    models.forEach((model) => {
      const productExits =
        productList.findIndex((p) => p.productId === model.productId) !== -1;
      if (model && productExits) {
        writeRequest.push({
          PutRequest: {
            Item: model.toItem(),
          },
        });
      }
    });

    return writeRequest;
  }

  private async getProductsByModels(
    models: ProductCategoryModel[],
  ): Promise<ItemList> {
    const prodKeys = [];
    models.forEach((model) => {
      if (model) {
        prodKeys.push(new ProductModel({ productId: model.productId }).keys());
      }
    });
    const prodResp = await this.docClient
      .batchGet({
        RequestItems: {
          [BaseModel.TABLE_NAME]: {
            Keys: prodKeys,
          },
        },
      })
      .promise();
    return prodResp?.Responses[BaseModel.TABLE_NAME] ?? [];
  }
}
