import { handlerPath } from '@libs/handler-resolver';
import { AWSFunction } from '@libs/lambda';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'categories/{id}',
        cors: {
          origin: '*',
        },
      },
    },
  ],
} as AWSFunction;
