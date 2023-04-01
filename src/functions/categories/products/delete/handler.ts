import { middyfy } from '@libs/lambda';

import { CategoryService } from '@services/category.service';

const deleteProducts = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(
    `Deleting products to category: ${id} ${JSON.stringify(_event.body)}`,
  );
  const response = await new CategoryService().deleteProductsToCategory(
    id,
    _event.body?.productIds ?? [],
  );
  console.log(`Leaving Deleting products to category `);
  return {
    ...response,
  };
};

export const main = middyfy(deleteProducts);
