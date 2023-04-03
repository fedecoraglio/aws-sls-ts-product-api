import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ulid } from 'ulid';

import { CategoryBuilder } from '@builders/category-builder';
import dynamoDBClient from '../dbconnect';
import { CategoryModel } from '@models/category.model';
import { CategoryDto } from '@dtos/category.dtos';
import { BaseModel } from '@models/base.model';
import { EntityName } from '@utils/entity-name.enum';
import {
  DEFAULT_LIMIT_PAGINATION,
  ListItem,
  PaginationItem,
} from '@utils/list-item.response';

export class CategoryRepository {
  private static instance: CategoryRepository;
  private readonly builder = CategoryBuilder.instance;
  private constructor(private readonly docClient: DocumentClient) {}

  static getInstance() {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository(dynamoDBClient());
    }
    return CategoryRepository.instance;
  }

  async create(dto: CategoryDto): Promise<CategoryModel> {
    try {
      return await this.save(dto, ulid());
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(dto: CategoryDto, id: string): Promise<CategoryModel> {
    try {
      return await this.save(dto, id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getById(categoryId: string): Promise<CategoryModel> {
    try {
      const resp = await this.docClient
        .get({
          TableName: BaseModel.TABLE_NAME,
          Key: this.builder.transformDtoToModel({ categoryId }).keys(),
        })
        .promise();
      return CategoryModel.fromItem(resp.Item);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getByName(name: string): Promise<CategoryModel> {
    try {
      const resp = await this.docClient
        .query({
          TableName: BaseModel.TABLE_NAME,
          KeyConditionExpression: '#pk = :pk',
          FilterExpression: '#name = :name',
          ExpressionAttributeValues: {
            ':name': name.trim().toLowerCase(),
            ':pk': EntityName.CATEGORY,
          },
          ExpressionAttributeNames: { '#name': 'name', '#pk': 'pk' },
        })
        .promise();
      return resp.Items.length ? CategoryModel.fromItem(resp.Items[0]) : null;
    } catch (err) {
      console.error('CategoryRepository', err);
      throw err;
    }
  }

  async getAll(
    pagination: PaginationItem = null,
  ): Promise<ListItem<CategoryModel>> {
    try {
      const exclusiveStartKey = pagination?.lastEvaluatedKey
        ? new CategoryModel({
            categoryId: pagination.lastEvaluatedKey,
          }).keys()
        : null;
      const resp = await this.docClient
        .query({
          TableName: BaseModel.TABLE_NAME,
          KeyConditionExpression: '#pk = :pk',
          FilterExpression: '#entityType = :entityType',
          ExpressionAttributeValues: {
            ':pk': EntityName.CATEGORY,
            ':entityType': EntityName.CATEGORY,
          },
          ExpressionAttributeNames: {
            '#pk': 'pk',
            '#entityType': 'entityType',
          },
          Limit: pagination?.limit ?? DEFAULT_LIMIT_PAGINATION,
          ExclusiveStartKey: exclusiveStartKey,
        })
        .promise();
      return {
        count: resp.Items?.length || 0,
        items: resp.Items?.map((cate) => CategoryModel.fromItem(cate)) || [],
        lastEvaluatedKey: BaseModel.getIdFromKey('sk', resp.LastEvaluatedKey),
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  private async save(
    dto: CategoryDto,
    categoryId: string = ulid(),
  ): Promise<CategoryModel> {
    try {
      await this.docClient
        .put({
          TableName: BaseModel.TABLE_NAME,
          Item: this.builder
            .transformDtoToModel({
              ...dto,
              name: dto.name?.trim().toLowerCase(),
              categoryId,
            })
            .toItem(),
          ConditionExpression: 'attribute_not_exists(PK)',
        })
        .promise();
      return await this.getById(categoryId);
    } catch (err) {
      console.error('CategoryRespository', err);
      throw err;
    }
  }
}
