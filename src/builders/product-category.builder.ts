import { ProductCategoryDto } from '@dtos/product.dtos';
import { ProductCategoryModel } from '@models/product-category.model';

export class ProductCategoryBuilder
  implements Builder<ProductCategoryModel, ProductCategoryDto>
{
  static instance = new ProductCategoryBuilder();
  private constructor() {}

  transformDtoToModel(dto: ProductCategoryDto): ProductCategoryModel {
    return new ProductCategoryModel({
      productId: dto.productId,
      categoryId: dto.categoryId,
      createdAt: dto.createdAt,
    });
  }
  transformModelToDto(model: ProductCategoryModel): ProductCategoryDto {
    return {
      productId: model.productId,
      categoryId: model.categoryId,
      createdAt: model.createdAt,
    };
  }
  transformModelsToDtos(models: ProductCategoryModel[]): ProductCategoryDto[] {
    return models.map((dto) => this.transformModelToDto(dto));
  }
  transformDtosToModels(dtos: ProductCategoryDto[]): ProductCategoryModel[] {
    return dtos.map((model) => this.transformDtoToModel(model));
  }
}
