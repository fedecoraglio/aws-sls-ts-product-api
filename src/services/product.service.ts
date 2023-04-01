import { ProductModel } from '@models/product.model';
import { ProductRepository } from '@repositories/product.repository';
import { ProductBuilder } from '@builders/product-builder';
import { ListProductDto, ProductDto } from '@dtos/product.dtos';
import { ListItem } from '@utils/list-item.response';
import { AppError } from '../libs/app-error';

export class ProductService {
  private readonly builder = ProductBuilder.instance;
  private readonly repository = ProductRepository.getInstance();

  async create(dto: ProductDto): Promise<ProductModel> {
    let product = null;
    try {
      const productExits = await this.repository.getByName(dto.name);
      if (productExits) {
        throw {
          message: `The ${dto.name} product is duplicated. Product name must be unique`,
        };
      }
      product = await this.repository.create(dto);
      console.log('product', product);
    } catch (err) {
      console.error('ProductService', err);
      throw err;
    }
    return product;
  }

  async update(dto: ProductDto, id: string): Promise<ProductModel> {
    let product = null;
    try {
      const validateProduct = await this.repository.getById(id);
      if (validateProduct) {
        const productExits = await this.repository.getByName(dto.name);
        if (productExits && id !== productExits.productId) {
          throw {
            message: `${dto.name} is duplicated. Product name must be unique`,
          };
        }
        product = await this.repository.update(dto, id);
      } else {
        throw { message: `The product ${id} id does not exits` };
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
    return product;
  }

  async getAll(): Promise<ListProductDto> {
    try {
      return await this.repository.getAll();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getById(id: string): Promise<ProductDto> {
    try {
      const model = await this.repository.getById(id);
      const product = this.builder.transformModelToDto(model);
      if (!product) {
        throw new AppError('Product does not exists', 404);
      }
      return product;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getProductsByCategoryId(
    categoryId: string,
  ): Promise<ListItem<ProductDto>> {
    try {
      const resp = await this.repository.getProductsByCategoryId(categoryId);
      return {
        count: resp.count,
        items: this.builder.transformModelsToDtos(resp.items),
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
