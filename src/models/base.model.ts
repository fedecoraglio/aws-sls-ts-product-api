import { Key } from 'aws-sdk/clients/dynamodb';
import { EntityName } from '@utils/entity-name.enum';

export abstract class BaseModel {
  abstract get pk(): string;
  abstract get sk(): string;
  entityType: EntityName;

  constructor(entityType: EntityName) {
    this.entityType = entityType;
  }

  keys(): Record<string, unknown> {
    return {
      pk: this.pk,
      sk: this.sk,
    };
  }

  abstract toItem(): Record<string, unknown>;

  static TABLE_NAME = 'products';
  static GSI1_INDEX = 'gsi1';
  static NAME_INDEX = 'name-index';

  static getIdFromKey(field: string, key: Key) {
    return key && key[field] ? key[field].toString().split('#')[1] : null;
  }
}
