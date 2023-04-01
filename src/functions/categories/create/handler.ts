import { middyfy } from '@libs/lambda';

import { CategoryService } from '@services/category.service';

const create = async (_event, _context) => {
  console.log(`Creating new category ${JSON.stringify(_event.body)}`);
  const response = await new CategoryService().create(_event.body);
  console.log(`Leaving new category ${JSON.stringify(_event.body)}`);
  return {
    ...response,
  };
};

export const main = middyfy(create);
