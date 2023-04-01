import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ulid } from 'ulid';

import { ProductModel } from '@models/product.model';
import { BaseModel } from '@models/base.model';
import { ProductDto } from '@dtos/product.dtos';
import { ProductBuilder } from '@builders/product-builder';
import dynamoDBClient from '../dbconnect';
import { ListItem } from '@utils/list-item.response';
import { EntityName } from '@utils/entity-name.enum';
import { ProductCategoryModel } from '@models/product-category.model';

export class ProductRepository {
  private static instance: ProductRepository;
  private readonly builder = ProductBuilder.instance;
  private constructor(private readonly docClient: DocumentClient) {}

  static getInstance() {
    if (!ProductRepository.instance) {
      ProductRepository.instance = new ProductRepository(dynamoDBClient());
    }
    return ProductRepository.instance;
  }

  async create(dto: ProductDto): Promise<ProductModel> {
    try {
      return await this.save(dto, ulid());
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(dto: ProductDto, id: string): Promise<ProductModel> {
    try {
      return await this.save(dto, id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getAll(): Promise<ListItem<ProductModel>> {
    try {
      const resp = await this.docClient
        .query({
          TableName: BaseModel.TABLE_NAME,
          KeyConditionExpression: '#pk = :pk',
          FilterExpression: '#entityType = :entityType',
          ExpressionAttributeValues: {
            ':pk': EntityName.PRODUCT,
            ':entityType': EntityName.PRODUCT,
          },
          ExpressionAttributeNames: {
            '#pk': 'pk',
            '#entityType': 'entityType',
          },
          Limit: 10,
        })
        .promise();
      return {
        count: resp.Items?.length || 0,
        items: resp.Items?.map((prod) => ProductModel.fromItem(prod)) || [],
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getProductsByCategoryId(
    categoryId: string,
  ): Promise<ListItem<ProductModel>> {
    const listItem = { count: 0, items: [] };
    try {
      const resp = await this.docClient
        .query({
          TableName: BaseModel.TABLE_NAME,
          IndexName: BaseModel.GSI1_INDEX,
          KeyConditionExpression: '#gsi1pk =:gsi1pk',
          ExpressionAttributeValues: {
            ':gsi1pk': `${EntityName.PRODUCT_CATEGORY}#${categoryId}`,
          },
          ExpressionAttributeNames: { '#gsi1pk': 'gsi1pk' },
          Limit: 10,
        })
        .promise();

      if (resp.Count > 0) {
        // Getting all productIds
        const prodKeys = resp.Items.filter((item) => !!item.productId).map(
          (item) => new ProductModel({ productId: item.productId }).keys(),
        );
        // Creating batch gets for all keys
        const currentProdResp = await this.docClient
          .batchGet({
            RequestItems: {
              [BaseModel.TABLE_NAME]: {
                Keys: prodKeys,
              },
            },
          })
          .promise();
        // Preparing product model response
        const items =
          currentProdResp?.Responses[BaseModel.TABLE_NAME]?.map((prod) =>
            ProductModel.fromItem(prod),
          ) ?? [];

        listItem.items = items;
        listItem.count = items.length;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
    return listItem;
  }

  async getById(productId: string): Promise<ProductModel> {
    try {
      const resp = await this.docClient
        .get({
          TableName: ProductModel.TABLE_NAME,
          Key: this.builder.transformDtoToModel({ productId }).keys(),
        })
        .promise();
      return ProductModel.fromItem(resp.Item);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getByName(name: string): Promise<ProductModel> {
    try {
      const resp = await this.docClient
        .query({
          TableName: BaseModel.TABLE_NAME,
          KeyConditionExpression: '#pk =:pk',
          FilterExpression: '#name =:name',
          ExpressionAttributeValues: {
            ':name': name.trim().toLowerCase(),
            ':pk': EntityName.PRODUCT,
          },
          ExpressionAttributeNames: { '#name': 'name', '#pk': 'pk' },
          ProjectionExpression: '#name',
          Limit: 1,
        })
        .promise();
      return resp.Items.length ? ProductModel.fromItem(resp.Items[0]) : null;
    } catch (err) {
      console.error('ProductRepository', err);
      throw err;
    }
  }

  private async save(
    dto: ProductDto,
    productId: string = ulid(),
  ): Promise<ProductModel> {
    try {
      await this.docClient
        .put({
          TableName: BaseModel.TABLE_NAME,
          Item: this.builder
            .transformDtoToModel({
              ...dto,
              name: dto.name?.trim().toLowerCase(),
              productId,
            })
            .toItem(),
          ConditionExpression: 'attribute_not_exists(PK)',
        })
        .promise();
      return await this.getById(productId);
    } catch (err) {
      console.error('ProductRespository', err);
      throw err;
    }
  }
}
