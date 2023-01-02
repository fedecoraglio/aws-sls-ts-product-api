import productRepository from '../repositories';
import { ProductModel } from '@models/product.model';
import { NewProductDto } from '@dtos/new-product.dto';
import { ListProductDto } from '@dtos/list-product.dto';

export class ProductService {
  async saveProduct(dto: NewProductDto): Promise<ProductModel> {
    let product = null;
    try {
      const productExits = await productRepository.getProductByName(
        dto.productName,
      );
      if (productExits) {
        throw {
          message: `The ${dto.productName} product is duplicated. Product name must be unique`,
        };
      }
      product = await productRepository.createProduct(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
    return product;
  }

  async updateProduct(dto: NewProductDto, id: string): Promise<ProductModel> {
    let product = null;
    try {
      const validateProduct = await productRepository.getProductById(id);
      if (validateProduct) {
        const productExits = await productRepository.getProductByName(
          dto.productName,
        );
        if (productExits && id !== productExits.productID) {
          throw {
            message: `${dto.productName} is duplicated. Product name must be unique`,
          };
        }
        product = await productRepository.updateProduct(dto, id);
      } else {
        throw { message: `The product ${id} id does not exits` };
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
    return product;
  }

  async getProducts(): Promise<ListProductDto> {
    try {
      return await productRepository.getProducts();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getProductById(id: string): Promise<ProductModel> {
    try {
      return await productRepository.getProductById(id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
