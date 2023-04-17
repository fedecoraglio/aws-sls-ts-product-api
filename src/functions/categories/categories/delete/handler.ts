import { middyfy } from '@libs/lambda';

import { CategoryService } from '@services/category.service';

const deleteCategories = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(
    `Deleting categories to category: ${id} ${JSON.stringify(_event.body)}`,
  );
  const response = await new CategoryService().deleteCategoriesToCategory(
    id,
    _event.body?.categoryIds ?? [],
  );
  console.log(`Leaving deleting categories to category `);
  return {
    ...response,
  };
};

export const main = middyfy(deleteCategories);
