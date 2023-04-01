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
}
