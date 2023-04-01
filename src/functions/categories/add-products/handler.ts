import { middyfy } from '@libs/lambda';

import { CategoryService } from '@services/category.service';

const create = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(`Creating new category id: ${id} ${JSON.stringify(_event.body)}`);
  const response = await new CategoryService().addProductsToCategory(
    id,
    _event.body?.productIds ?? [],
  );
  console.log(`Leaving new category ${JSON.stringify(_event.body)}`);
  return {
    ...response,
  };
};

export const main = middyfy(create);
