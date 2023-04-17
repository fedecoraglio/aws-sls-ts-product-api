import { EntityName } from '@utils/entity-name.enum';
import { BaseModel } from './base.model';
import { MetaDataType, ProductType } from './types.model';

export class ProductModel extends BaseModel {
  productId: string;
  categoryIds: string[];
  name: string;
  summary: string;
  content: string;
  metaData: MetaDataType[];
  metaDataKeys?: string[];
  createdAt: string;

  constructor(productType: ProductType) {
    super(EntityName.PRODUCT);
    this.productId = productType.productId;
    this.name = productType.name;
    this.summary = productType.summary;
    this.content = productType.content;
    this.metaData = productType.metaData;
    this.metaDataKeys = productType.metaDataKeys;
    this.categoryIds = productType.categoryIds || [];
  }

  get pk(): string {
    return EntityName.PRODUCT;
  }

  get sk(): string {
    return `${EntityName.PRODUCT}#${this.productId}`;
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      productId: this.productId,
      categoryIds: this.categoryIds,
      name: this.name,
      summary: this.summary,
      content: this.content,
      metaData: this.metaData,
      metaDataKeys: this.metaData?.map(({ key }) => key),
      entityType: this.entityType,
      createdAt: new Date().getTime(),
    };
  }

  static fromItem(item?: any): ProductModel | null {
    if (!item) return null;
    return new ProductModel({
      productId: item.productId,
      categoryIds: item.categoryIds,
      ...item,
    });
  }
}
