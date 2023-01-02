import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';

const detailProduct = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(`Getting detail product. Data: ${id}`);
  const response = await new ProductService().getProductById(id);
  console.log(`Leaving detail product. Data: ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(detailProduct);
