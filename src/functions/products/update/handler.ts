import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';

const updateProduct = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Updating new products ${JSON.stringify(_event.body)}`);
  const response = await new ProductService().updateProduct(_event.body, id);
  console.log(`Leaving new products ${JSON.stringify(_event.body)}`);
  return {
    ...response,
  };
};

export const main = middyfy(updateProduct);
