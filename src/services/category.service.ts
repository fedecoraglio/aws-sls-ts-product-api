import { CategoryBuilder } from '@builders/category-builder';
import { CategoryDto } from '@dtos/category.dtos';
import { ProductCategoryResp } from '@dtos/product.dtos';
import { CategoryModel } from '@models/category.model';
import { CategoryRepository } from '@repositories/category.repository';
import { ProductCategoryRepository } from '@repositories/product-category.repository';
import { AppError } from '@libs/app-error';
import {
  ListItem,
  PaginationItem,
  SimpleSearchParam,
} from '../utils/list-item.response';

export class CategoryService {
  private readonly builder = CategoryBuilder.instance;
  private readonly repository = CategoryRepository.getInstance();
  private readonly prodCatRepository = ProductCategoryRepository.getInstance();

  async create(dto: CategoryDto): Promise<CategoryModel> {
    let category = null;
    const categoryExits = await this.repository.getByName(dto.name);
    if (categoryExits) {
      throw {
        message: `${dto.name} category is duplicated. Category name must be unique`,
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
      const [validateCategory, categoryName] = await Promise.all([
        this.repository.getById(id),
        this.repository.getByName(dto.name),
      ]);
      if (validateCategory) {
        if (categoryName && id !== categoryName.categoryId) {
          throw {
            message: `${dto.name} is duplicated. Category name must be unique`,
            statusCode: 404,
          };
        }

        category = await this.repository.update(dto, id);
      } else {
        throw {
          message: `Category not found`,
          statusCode: 404,
        };
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

  async getAll(
    searchParam: SimpleSearchParam | null = null,
    pagination: PaginationItem = null,
  ): Promise<ListItem<CategoryDto>> {
    try {
      const categoryResp = await this.repository.getAll(
        searchParam,
        pagination,
      );
      return {
        count: categoryResp?.count || 0,
        items: this.builder.transformModelsToDtos(categoryResp?.items) || [],
        lastEvaluatedKey: categoryResp.lastEvaluatedKey,
      };
    } catch (err) {
      console.error('CategoryService-getAll', err);
      throw err;
    }
  }

  async deleteProductsToCategory(
    categoryId: string,
    productIds: string[],
  ): Promise<ProductCategoryResp> {
    return await this.bulkProductsToCategory(categoryId, productIds, false);
  }

  async addProductsToCategory(
    categoryId: string,
    productIds: string[],
  ): Promise<ProductCategoryResp> {
    return await this.bulkProductsToCategory(categoryId, productIds, true);
  }

  private async bulkProductsToCategory(
    categoryId: string,
    productIds: string[],
    isCreate: boolean,
  ) {
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

      if (productCategories.length) {
        if (isCreate) {
          success = await this.prodCatRepository.create(
            categoryId,
            productCategories,
          );
        } else {
          success = await this.prodCatRepository.delete(
            categoryId,
            productCategories,
          );
        }
      }
    } catch (err) {
      console.error('CategoryService-bulkProducts', err);
      throw err;
    }

    return { success };
  }
}
