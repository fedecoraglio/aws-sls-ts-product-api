import {
  DocumentClient,
  ItemList,
  WriteRequest,
} from 'aws-sdk/clients/dynamodb';

import { BaseModel } from '@models/base.model';
import dynamoDBClient from '../dbconnect';
import { CategoryCategoryBuilder } from '@builders/category-category.builder';
import { CategoryCategoryDto } from '@dtos/category.dtos';
import { CategoryCategoryModel } from '@models/category-category.model';
import { CategoryModel } from '@models/category.model';
import { DeleteBatchRepository, SaveBatchRepository } from './types.repository';

export class CategoryCategoryRepository
  implements
    SaveBatchRepository<CategoryCategoryDto>,
    DeleteBatchRepository<CategoryCategoryDto>
{
  private static instance: CategoryCategoryRepository;
  private readonly builder = CategoryCategoryBuilder.instance;
  private constructor(private readonly docClient: DocumentClient) {}

  static getInstance() {
    if (!CategoryCategoryRepository.instance) {
      CategoryCategoryRepository.instance = new CategoryCategoryRepository(
        dynamoDBClient(),
      );
    }
    return CategoryCategoryRepository.instance;
  }

  async saveBatch(
    categoryParentId: string,
    dtos: CategoryCategoryDto[],
  ): Promise<boolean> {
    try {
      return await this.batchPutCategory(categoryParentId, dtos);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteBatch(
    categoryParentId: string,
    dtos: CategoryCategoryDto[],
  ): Promise<boolean> {
    try {
      return await this.batchDeleteCategory(categoryParentId, dtos);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async batchDeleteCategory(
    categoryId: string,
    dtos: CategoryCategoryDto[],
  ): Promise<boolean> {
    try {
      await this.docClient
        .batchWrite({
          RequestItems: {
            [BaseModel.TABLE_NAME]: await this.createDeleteCategoryRequest(
              categoryId,
              dtos,
            ),
          },
        })
        .promise();
      return true;
    } catch (err) {
      console.error('ProductCategoryRepository', err);
      throw err;
    }
  }

  private async batchPutCategory(
    categoryParentId: string,
    dtos: CategoryCategoryDto[],
  ): Promise<boolean> {
    try {
      const data = {
        RequestItems: {
          products: await this.createPutCategoryRequest(categoryParentId, dtos),
        },
      };
      await this.docClient.batchWrite(data).promise();
      return true;
    } catch (err) {
      console.error('ProductCategoryRepository', err);
      throw err;
    }
  }

  private async createDeleteCategoryRequest(
    categoryParentId: string,
    dtos: CategoryCategoryDto[],
  ): Promise<WriteRequest[]> {
    const writeRequest: WriteRequest[] = [];
    const models = this.builder.transformDtosToModels(dtos);
    const categoryList = await this.getCategoriesByModels(models);
    categoryList.forEach((item: any) => {
      if (item.categoryParentIds?.length) {
        const categories = item.categoryParentIds.filter(
          (catId: string) => catId !== categoryParentId,
        );
        item.categoryParentIds = categories;
        writeRequest.push({
          DeleteRequest: {
            Key: new CategoryModel(item).keys(),
          },
        });
      }
    });

    models.forEach((model) => {
      const categoryExits =
        categoryList.findIndex((c) => c.categoryId === model.categoryId) !== -1;
      if (model && categoryExits) {
        writeRequest.push({
          DeleteRequest: {
            Key: model.keys(),
          },
        });
      }
    });

    return writeRequest;
  }

  private async createPutCategoryRequest(
    categoryParentId: string,
    dtos: CategoryCategoryDto[],
  ): Promise<WriteRequest[]> {
    const writeRequest: WriteRequest[] = [];
    const models = this.builder.transformDtosToModels(dtos);
    const categoryList = await this.getCategoriesByModels(models);
    categoryList.forEach((item: any) => {
      const categoryParentIds = item.categoryParentIds ?? [];
      const idx = categoryParentIds.findIndex(
        (catId: string) => catId === categoryParentId,
      );
      if (idx === -1 || categoryParentIds.length === 0) {
        categoryParentIds.push(categoryParentId);
        item.categoryParentIds = categoryParentIds;
        writeRequest.push({
          PutRequest: {
            Item: new CategoryModel(item).toItem(),
          },
        });
      }
    });

    models.forEach((model) => {
      const categoryExits =
        categoryList.findIndex((c) => c.categoryId === model.categoryId) !== -1;
      if (model && categoryExits) {
        writeRequest.push({
          PutRequest: {
            Item: model.toItem(),
          },
        });
      }
    });

    return writeRequest;
  }

  private async getCategoriesByModels(
    models: CategoryCategoryModel[],
  ): Promise<ItemList> {
    const categoryKeys = [];
    models.forEach((model) => {
      if (model) {
        categoryKeys.push(
          new CategoryModel({ categoryId: model.categoryId }).keys(),
        );
      }
    });
    const prodResp = await this.docClient
      .batchGet({
        RequestItems: {
          [BaseModel.TABLE_NAME]: {
            Keys: categoryKeys,
          },
        },
      })
      .promise();
    return prodResp?.Responses[BaseModel.TABLE_NAME] ?? [];
  }
}
