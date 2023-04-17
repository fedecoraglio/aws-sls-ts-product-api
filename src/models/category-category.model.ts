import { EntityName } from '@utils/entity-name.enum';
import { BaseModel } from './base.model';

type CategoryCategoryType = Partial<{
  categoryParentId: string;
  categoryId: string;
  createdAt?: Date | null | undefined;
}>;

export class CategoryCategoryModel extends BaseModel {
  categoryParentId: string;
  categoryId: string;
  createdAt: Date;

  constructor(categoryParentType: CategoryCategoryType) {
    super(EntityName.CATEGORY_CATEGORY);
    this.categoryId = categoryParentType.categoryId;
    this.categoryParentId = categoryParentType.categoryParentId;
    this.createdAt = categoryParentType.createdAt ?? new Date();
  }

  get pk(): string {
    return `${EntityName.CATEGORY_CATEGORY}#${this.categoryId}`;
  }

  get sk(): string {
    return `${EntityName.CATEGORY_CATEGORY}#${this.categoryParentId}`;
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
      categoryParentId: this.categoryParentId,
      categoryId: this.categoryId,
      createdAt: this.createdAt,
      entityType: this.entityType,
    };
  }
}
