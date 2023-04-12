import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';

const deleteProduct = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Starting Deleting product ${id}`);
  const response = await new ProductService().delete(id);
  console.log(`Leaving Deleting product ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(deleteProduct);
