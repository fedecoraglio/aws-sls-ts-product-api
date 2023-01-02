import { handlerPath } from '@libs/handler-resolver';
import { AWSFunction } from '@libs/lambda';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        cors: {
          origin: '*',
        },
      },
    },
  ],
} as AWSFunction;
