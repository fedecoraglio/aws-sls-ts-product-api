import { middyfy } from '@libs/lambda';
import { CategoryService } from '@services/category.service';

const updateProduct = async (_event, _context) => {
  const id = _event.pathParameters?.id;
  console.log(`Updating new products ${JSON.stringify(_event.body)}`);
  const response = await new CategoryService().update(_event.body, id);
  console.log(`Leaving new products ${JSON.stringify(_event.body)}`);
  return {
    ...response,
  };
};

export const main = middyfy(updateProduct);
