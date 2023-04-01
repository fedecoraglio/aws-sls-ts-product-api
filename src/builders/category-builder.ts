import { CategoryDto } from '@dtos/category.dtos';
import { CategoryModel } from '@models/category.model';

export class CategoryBuilder implements Builder<CategoryModel, CategoryDto> {
  static instance = new CategoryBuilder();
  private constructor() {}

  transformDtoToModel(dto: CategoryDto): CategoryModel {
    return new CategoryModel({ ...dto });
  }
  transformModelToDto(model: CategoryModel): CategoryDto {
    if (!model) return null;
    return {
      categoryId: model.categoryId,
      name: model.name,
      summary: model.summary,
      content: model.content,
    };
  }
  transformModelsToDtos(models: CategoryModel[]): CategoryDto[] {
    return models.map((dto) => this.transformModelToDto(dto));
  }
  transformDtosToModels(dtos: CategoryDto[]): CategoryModel[] {
    return dtos.map((model) => this.transformDtoToModel(model));
  }
}
