import { middyfy } from '@libs/lambda';
import { CategoryService } from '@services/category.service';

const deleteCategory = async (_event, _context) => {
  const id = _event.pathParameters.id;
  console.log(`Deleting. Data: ${id}`);
  const response = await new CategoryService().delete(id);
  console.log(`Leaving deleting. Data: ${id}`);
  return {
    ...response,
  };
};

export const main = middyfy(deleteCategory);
