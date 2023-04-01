import { EntityName } from '../utils/entity-name.enum';
import { BaseModel } from './base.model';

type CategoryType = Partial<{
  categoryId: string;
  name: string;
  summary: string;
  content: string;
}>;

export class CategoryModel extends BaseModel {
  categoryId: string;
  name: string;
  summary: string;
  content: string;

  constructor(productType: CategoryType) {
    super();
    this.categoryId = productType.categoryId;
    this.name = productType.name;
    this.summary = productType.summary;
    this.content = productType.content;
    this.entityType = EntityName.CATEGORY;
  }

  get pk(): string {
    return EntityName.CATEGORY;
  }
  get sk(): string {
    return `${EntityName.CATEGORY}#${this.categoryId}`;
  }

  get gsi1pk(): string {
    return this.categoryId;
  }

  get gsi1sk(): string {
    return this.sk;
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      gsi1pk: this.gsi1pk,
      gsi1sk: this.gsi1sk,
      categoryId: this.categoryId,
      name: this.name,
      summary: this.summary,
      content: this.content,
      entityType: this.entityType,
    };
  }

  static fromItem(item?: CategoryType): CategoryModel | null {
    if (!item) return null;
    return new CategoryModel({
      categoryId: item.categoryId,
      name: item.name,
      summary: item.summary,
      content: item.content,
    });
  }
}
