import { middyfy } from '@libs/lambda';
import { CategoryService } from '../../../services/category.service';

const listProduct = async (_event, _context) => {
  console.log(`Getting products`);
  const response = await new CategoryService().getAllCategories();
  console.log(`Leaving products`);
  return {
    ...response,
  };
};

export const main = middyfy(listProduct);
