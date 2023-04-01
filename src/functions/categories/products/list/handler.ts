import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';

const listProducts = async (_event, _context) => {
  console.log(`Getting products`);
  const id = _event.pathParameters.id;
  const response = await new ProductService().getProductsByCategoryId(id);
  console.log(`Leaving products`);
  return {
    ...response,
  };
};

export const main = middyfy(listProducts);
