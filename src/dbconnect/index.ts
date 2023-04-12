import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDBClient = (): DocumentClient => {
  return new AWS.DynamoDB.DocumentClient({
    accessKeyId: '4jqb3k',
    secretAccessKey: '8rm38a',
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
};
export default dynamoDBClient;
