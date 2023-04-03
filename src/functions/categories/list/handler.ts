import { middyfy } from '@libs/lambda';
import { CategoryService } from '@services/category.service';
import { DEFAULT_LIMIT_PAGINATION } from '@utils/list-item.response';

const listCategory = async (_event, _context) => {
  console.log(`Getting categories`);
  const response = await new CategoryService().getAll({
    limit: _event?.queryStringParameters?.limit ?? DEFAULT_LIMIT_PAGINATION,
    lastEvaluatedKey: _event?.queryStringParameters?.lastEvaluatedKey ?? null,
  });
  console.log(`Leaving categories`);
  return {
    ...response,
  };
};

export const main = middyfy(listCategory);
