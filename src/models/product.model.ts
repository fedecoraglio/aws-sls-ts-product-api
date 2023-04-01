import { EntityName } from '@utils/entity-name.enum';
import { BaseModel } from './base.model';

type ProductType = Partial<{
  productId: string;
  name: string;
  summary: string;
  content: string;
  metaData: { key: string; content: string }[];
  metaDataKeys?: string[];
  categoryIds: string[];
  createdAt: string[];
}>;

type ProductMetaDataType = Readonly<{
  key: string;
  content: string;
}>;
export class ProductModel extends BaseModel {
  productId: string;
  name: string;
  summary: string;
  content: string;
  metaData: ProductMetaDataType[];
  categoryIds: string[];
  metaDataKeys: string[];
  createdAt: string;

  constructor(productType: ProductType) {
    super();
    this.productId = productType.productId;
    this.name = productType.name;
    this.summary = productType.summary;
    this.content = productType.content;
    this.metaData = productType.metaData;
    this.metaDataKeys = productType.metaDataKeys;
    this.categoryIds = productType.categoryIds || [];
    this.entityType = EntityName.PRODUCT;
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
      name: this.name,
      summary: this.summary,
      content: this.content,
      metaData: this.metaData,
      metaDataKeys: this.metaData?.map(({ key }) => key),
      categoryIds: this.categoryIds,
      entityType: this.entityType,
      createdAt: new Date().getTime(),
    };
  }

  static fromItem(item?: ProductType): ProductModel | null {
    if (!item) return null;
    return new ProductModel({
      productId: item.productId,
      name: item.name,
      summary: item.summary,
      content: item.content,
      metaData: item.metaData,
      metaDataKeys: item.metaDataKeys,
      categoryIds: item.categoryIds,
      createdAt: item.createdAt,
    });
  }
}
