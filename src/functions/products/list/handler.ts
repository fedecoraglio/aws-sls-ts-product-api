import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';

const listProduct = async (_event, _context) => {
  console.log(`Getting products`);
  const response = await new ProductService().getProducts();
  console.log(`Leaving products`);
  return {
    ...response,
  };
};

export const main = middyfy(listProduct);
