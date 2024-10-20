import { transpileSchema } from '@middy/validator/transpile';

export default transpileSchema({
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['OPEN', 'CLOSED'],
          default: 'OPEN',
        },
      },
    },
  },
  required: ['queryStringParameters'],
});
