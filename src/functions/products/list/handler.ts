import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';

const listProduct = async (_event, _context) => {
  console.log(`Getting products`);
  const response = await new ProductService().getAll();
  console.log(`Leaving products`);
  return {
    ...response,
  };
};

export const main = middyfy(listProduct);
