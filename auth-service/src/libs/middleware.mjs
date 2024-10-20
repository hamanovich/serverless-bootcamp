import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';

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

export default (handler) =>
  middy(handler).use([
    httpJsonBodyParser({ disableContentTypeError: true }),
    httpEventNormalizer(),
    httpErrorHandler(),
    cors(),
    jsonContentTypeMiddleware(),
  ]);
