import { Key } from 'aws-sdk/clients/dynamodb';

export abstract class BaseModel {
  abstract get pk(): string;
  abstract get sk(): string;
  entityType: string;

  keys(): Record<string, unknown> {
    return {
      pk: this.pk,
      sk: this.sk,
    };
  }

  abstract toItem(): Record<string, unknown>;

  static TABLE_NAME = 'products';
  static GSI1_INDEX = 'gsi1';

  static getIdFromKey(field: string, key: Key) {
    return key && key[field] ? key[field].toString().split('#')[1] : null;
  }
}
