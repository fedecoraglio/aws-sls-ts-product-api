import { middyfy } from '@libs/lambda';

import { CategoryService } from '@services/category.service';

const addCategory = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(
    `Adding new category to category: ${id} ${JSON.stringify(_event.body)}`,
  );
  const response = await new CategoryService().addCategoriesToCategory(
    id,
    _event.body?.categoryIds ?? [],
  );
  console.log(
    `Leaving adding new category to category${JSON.stringify(_event.body)}`,
  );
  return {
    ...response,
  };
};

export const main = middyfy(addCategory);
