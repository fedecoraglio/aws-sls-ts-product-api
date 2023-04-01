import { CategoryBuilder } from '@builders/category-builder';
import { CategoryDto, ListCategoryDto } from '@dtos/category.dtos';
import { ProductCategoryResp } from '@dtos/product.dtos';
import { CategoryModel } from '@models/category.model';
import { CategoryRepository } from '@repositories/category.repository';
import { ProductCategoryRepository } from '@repositories/product-category.repository';
import { AppError } from '@libs/app-error';

export class CategoryService {
  private readonly builder = CategoryBuilder.instance;
  private readonly repository = CategoryRepository.getInstance();
  private readonly prodCatRepository = ProductCategoryRepository.getInstance();

  async create(dto: CategoryDto): Promise<CategoryModel> {
    let category = null;
    const categoryExits = await this.repository.getByName(dto.name);
    if (categoryExits) {
      throw {
        message: `The ${dto.name} category is duplicated. Category name must be unique`,
      };
    }
    try {
      category = await this.repository.create(dto);
    } catch (err) {
      console.error('CategoryService-create', err);
      throw err;
    }
    return category;
  }

  async update(dto: CategoryDto, id: string): Promise<CategoryModel> {
    let category = null;
    try {
      const validateCategory = await this.repository.getById(id);
      if (validateCategory) {
        category = await this.repository.update(dto, id);
      } else {
        throw { message: `The category ${id} id does not exits` };
      }
    } catch (err) {
      console.error('CategoryService-update', err);
      throw err;
    }
    return category;
  }

  async getById(id: string): Promise<CategoryDto> {
    try {
      const model = await this.repository.getById(id);
      const category = this.builder.transformModelToDto(model);
      if (!category) {
        throw new AppError('Category does not exists', 404);
      }
      return category;
    } catch (err) {
      console.error('CategoryService-getById', err);
      throw err;
    }
  }

  async getAllCategories(): Promise<ListCategoryDto> {
    try {
      const categoryResp = await this.repository.getAll();
      return {
        count: categoryResp?.count || 0,
        items: this.builder.transformModelsToDtos(categoryResp?.items) || [],
      };
    } catch (err) {
      console.error('CategoryService-getAllCategories', err);
      throw err;
    }
  }

  async addProductsToCategory(
    categoryId: string,
    productIds: string[],
  ): Promise<ProductCategoryResp> {
    let success = false;
    if (!productIds || productIds.length === 0) {
      throw { message: 'You must provide at least one product' };
    }

    try {
      const productCategories = productIds
        .filter((id) => !!id)
        .map((id) => {
          return { categoryId, productId: id, createdAt: new Date() };
        });

      console.log('PASA!!!!!');
      if (productCategories.length) {
        success = await this.prodCatRepository.create(
          categoryId,
          productCategories,
        );
      }
    } catch (err) {
      console.error('CategoryService-addProductsToCategory', err);
      throw err;
    }

    return { success };
  }
}
