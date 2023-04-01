import { ProductDto } from '@dtos/product.dtos';
import { ProductModel } from '@models/product.model';

export class ProductBuilder implements Builder<ProductModel, ProductDto> {
  static instance = new ProductBuilder();
  private constructor() {}

  transformDtoToModel(dto: ProductDto): ProductModel {
    return new ProductModel({
      productId: dto.productId,
      name: dto.name,
      summary: dto.summary,
      content: dto.content,
      metaData: dto.metaData,
    });
  }
  transformModelToDto(model: ProductModel): ProductDto {
    if (!model) return null;
    return {
      productId: model.productId,
      name: model.name,
      summary: model.summary,
      content: model.content,
      metaData: model.metaData,
      entityType: model.entityType,
      categoryIds: model.categoryIds,
      metaDataKeys: model.metaDataKeys,
    };
  }
  transformModelsToDtos(models: ProductModel[]): ProductDto[] {
    return models.map((dto) => this.transformModelToDto(dto));
  }
  transformDtosToModels(dtos: ProductDto[]): ProductModel[] {
    return dtos.map((model) => this.transformDtoToModel(model));
  }
}
