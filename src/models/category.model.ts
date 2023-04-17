import { EntityName } from '../utils/entity-name.enum';
import { BaseModel } from './base.model';
import { CategoryType, MetaDataType } from './types.model';

export class CategoryModel extends BaseModel {
  categoryId: string;
  categoryParentIds: string[];
  name: string;
  summary: string;
  content: string;
  metaData: MetaDataType[];
  metaDataKeys?: string[];
  createdAt: string;

  constructor(type: CategoryType) {
    super(EntityName.CATEGORY);
    this.categoryId = type.categoryId;
    this.categoryParentIds = type.categoryParentIds;
    this.name = type.name;
    this.summary = type.summary;
    this.content = type.content;
    this.metaData = type.metaData;
    this.metaDataKeys = type.metaDataKeys;
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
      categoryParentIds: this.categoryParentIds,
      name: this.name,
      summary: this.summary,
      content: this.content,
      metaData: this.metaData,
      metaDataKeys: this.metaData?.map(({ key }) => key),
      entityType: this.entityType,
      createdAt: new Date().getTime(),
    };
  }

  static fromItem(item?: any): CategoryModel | null {
    if (!item) return null;
    return new CategoryModel({
      categoryId: item.categoryId,
      categoryParentIds: item.categoryParentIds,
      ...item,
    });
  }
}
