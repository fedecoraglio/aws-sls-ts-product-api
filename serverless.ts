import type { AWS } from '@serverless/typescript';

// Categories
import createProduct from '@functions/products/create';
import listProduct from '@functions/products/list';
import detailProduct from '@functions/products/detail';
import updateProduct from '@functions/products/update';
// Categories
import createCategory from '@functions/categories/create';
import addProductCategory from '@functions/categories/add-products';
import listCategory from '@functions/categories/list';
import detailCategory from '@functions/categories/detail';
import updateCategory from '@functions/categories/update';
import productsByCategory from '@functions/categories/list-products';

const serverlessConfiguration: AWS = {
  service: 'aws-sls-ts-product-api',
  frameworkVersion: '3',
  disabledDeprecations: ['CLI_OPTIONS_SCHEMA'],
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-dynamodb-local',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:DescribeTable',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
            Resource: '*',
          },
        ],
      },
    },
  },

  // import the function via paths
  functions: {
    createProduct,
    listProduct,
    detailProduct,
    updateProduct,
    listCategory,
    createCategory,
    addProductCategory,
    detailCategory,
    updateCategory,
    productsByCategory,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      products: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'pk',
              AttributeType: 'S',
            },
            {
              AttributeName: 'sk',
              AttributeType: 'S',
            },
            {
              AttributeName: 'gsi1pk',
              AttributeType: 'S',
            },
            {
              AttributeName: 'gsi1sk',
              AttributeType: 'S',
            },
          ],
          TableName: 'products',
          KeySchema: [
            {
              AttributeName: 'pk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'sk',
              KeyType: 'RANGE',
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'gsi1',
              KeySchema: [
                {
                  AttributeName: 'gsi1pk',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'gsi1sk',
                  KeyType: 'RANGE',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
              },
            },
          ],
          BillingMode: 'PROVISIONED',
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          StreamSpecification: {
            StreamEnabled: true,
            StreamViewType: 'NEW_IMAGE',
          },
          SSESpecification: {
            Enabled: true,
            SSEType: 'AES256',
            KMSMasterKeyId: '',
          },
          TableClass: 'STANDARD',
          DeletionProtectionEnabled: false,
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
