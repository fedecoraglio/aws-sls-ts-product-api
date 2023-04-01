import { EntityName } from '@utils/entity-name.enum';
import { BaseModel } from './base.model';

type ProductCategoryType = Partial<{
  productId: string;
  categoryId: string;
  createdAt?: Date | null | undefined;
}>;

export class ProductCategoryModel extends BaseModel {
  categoryId: string;
  productId: string;
  createdAt: Date;

  constructor(productCategoryType: ProductCategoryType) {
    super();
    this.categoryId = productCategoryType.categoryId;
    this.productId = productCategoryType.productId;
    this.createdAt = productCategoryType.createdAt ?? new Date();
    this.entityType = EntityName.PRODUCT_CATEGORY;
  }

  get pk(): string {
    return `${EntityName.PRODUCT_CATEGORY}#${this.productId}`;
  }

  get sk(): string {
    return `${EntityName.PRODUCT_CATEGORY}#${this.categoryId}`;
  }

  get gsi1pk(): string {
    return this.sk;
  }

  get gsi1sk(): string {
    return this.pk;
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      gsi1pk: this.gsi1pk,
      gsi1sk: this.gsi1sk,
      categoryId: this.categoryId,
      productId: this.productId,
      createdAt: this.createdAt,
      entityType: this.entityType,
    };
  }

  static fromItem(item?: any): ProductCategoryModel | null {
    if (!item) return null;
    return new ProductCategoryModel({
      categoryId: item.categoryId,
      productId: item.productId,
      createdAt: item.createdAt,
    });
  }
}
