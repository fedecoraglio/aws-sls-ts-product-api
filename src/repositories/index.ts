import dynamoDBClient from '../dbconnect';
import { ProductRepository } from './product.repository';

const productRepository = new ProductRepository(dynamoDBClient());

export default productRepository;
