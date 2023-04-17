import { CategoryCategoryDto } from '@dtos/category.dtos';
import { CategoryCategoryModel } from '@models/category-category.model';

export class CategoryCategoryBuilder
  implements Builder<CategoryCategoryModel, CategoryCategoryDto>
{
  static instance = new CategoryCategoryBuilder();
  private constructor() {}

  transformDtoToModel(dto: CategoryCategoryDto): CategoryCategoryModel {
    return new CategoryCategoryModel({
      categoryParentId: dto.categoryParentId,
      categoryId: dto.categoryId,
    });
  }
  transformModelToDto(model: CategoryCategoryModel): CategoryCategoryDto {
    return {
      categoryId: model.categoryId,
      categoryParentId: model.categoryParentId,
      createdAt: model.createdAt,
    };
  }
  transformModelsToDtos(
    models: CategoryCategoryModel[],
  ): CategoryCategoryDto[] {
    return models.map((dto) => this.transformModelToDto(dto));
  }
  transformDtosToModels(dtos: CategoryCategoryDto[]): CategoryCategoryModel[] {
    return dtos.map((model) => this.transformDtoToModel(model));
  }
}
