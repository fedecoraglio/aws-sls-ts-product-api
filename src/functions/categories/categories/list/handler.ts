import { middyfy } from '@libs/lambda';
import { CategoryService } from '@services/category.service';

const listProducts = async (_event, _context) => {
  console.log(`Getting categories by categories`);
  const id = _event.pathParameters.id;
  const response = await new CategoryService().getCategoriesByCategoryId(id);
  console.log(`Leaving categories by categories`);
  return {
    ...response,
  };
};

export const main = middyfy(listProducts);
