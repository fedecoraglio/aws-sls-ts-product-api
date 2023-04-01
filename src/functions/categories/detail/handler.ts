import { middyfy } from '@libs/lambda';
import { CategoryService } from '@services/category.service';

const detailProduct = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(`Getting detail product. Data: ${id}`);
  const response = await new CategoryService().getById(id);
  console.log(`Leaving detail product. Data: ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(detailProduct);
