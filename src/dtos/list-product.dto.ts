import { ProductModel } from '../models/product.model';

export interface ListProductDto {
  count: number;
  items: ProductModel[];
}
