import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 } from 'uuid';

import { ProductModel } from '@models/product.model';
import { NewProductDto } from '@dtos/new-product.dto';
import { ListProductDto } from '@dtos/list-product.dto';

const tableName = 'ProductsTable';

export class ProductRepository {
  constructor(private readonly docClient: DocumentClient) {}
  async createProduct(dto: NewProductDto): Promise<ProductModel> {
    try {
      return await this.saveProduct(dto, v4());
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateProduct(dto: NewProductDto, id: string): Promise<ProductModel> {
    try {
      return await this.saveProduct(dto, id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getProducts(): Promise<ListProductDto> {
    try {
      const resp = await this.docClient
        .scan({
          TableName: tableName,
        })
        .promise();
      return {
        count: resp.Count,
        items: (resp.Items || []) as ProductModel[],
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getProductById(id: string): Promise<ProductModel> {
    try {
      const resp = await this.docClient
        .get({
          TableName: tableName,
          Key: {
            productID: id,
          },
        })
        .promise();
      return resp.Item as ProductModel;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getProductByName(name: string): Promise<ProductModel> {
    try {
      const resp = await this.docClient
        .scan({
          TableName: tableName,
          FilterExpression: '#productName =:name',
          ExpressionAttributeValues: { ':name': name.toLowerCase() },
          ExpressionAttributeNames: { '#productName': 'productName' },
        })
        .promise();
      return resp?.Items.length ? (resp?.Items[0] as ProductModel) : null;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async saveProduct(
    dto: NewProductDto,
    id: string,
  ): Promise<ProductModel> {
    try {
      await this.docClient
        .put({
          TableName: tableName,
          Item: {
            productName: dto.productName.toLowerCase(),
            productID: id,
          },
        })
        .promise();
      return await this.getProductById(id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
