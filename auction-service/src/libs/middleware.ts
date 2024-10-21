import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

const jsonContentTypeMiddleware = () => ({
  after: async (handler) => {
    if (!handler.response) return;

    handler.response = {
      ...handler.response,
      headers: {
        ...handler.response.headers,
        'Content-Type': 'application/json',
      },
    };
  },
});

export default (handler: Handler) =>
  middy<APIGatewayProxyEvent, APIGatewayProxyResult>(handler).use([
    httpJsonBodyParser({ disableContentTypeError: true }),
    httpEventNormalizer(),
    httpErrorHandler(),
    cors(),
    jsonContentTypeMiddleware(),
  ]);
