import { middyfy } from '@libs/lambda';
import { ProductService } from '@services/product.service';
import { DEFAULT_LIMIT_PAGINATION } from '@utils/list-item.response';

const listProduct = async (_event, _context) => {
  console.log(`Getting products`);
  const response = await new ProductService().getAll({
    limit: _event?.queryStringParameters?.limit ?? DEFAULT_LIMIT_PAGINATION,
    lastEvaluatedKey: _event?.queryStringParameters?.lastEvaluatedKey ?? null,
  });
  console.log(`Leaving products`);
  return {
    ...response,
  };
};

export const main = middyfy(listProduct);
