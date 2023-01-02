import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';

const createProduct = async (_event, _context) => {
  console.log(`Creating new products ${JSON.stringify(_event.body)}`);
  const response = await new ProductService().saveProduct(_event.body);
  console.log(`Leaving new products ${JSON.stringify(_event.body)}`);
  return {
    ...response,
  };
};

export const main = middyfy(createProduct);
