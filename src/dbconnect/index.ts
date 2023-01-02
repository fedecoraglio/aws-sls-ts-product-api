import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDBClient = (): DocumentClient => {
  return new AWS.DynamoDB.DocumentClient();
};
export default dynamoDBClient;
