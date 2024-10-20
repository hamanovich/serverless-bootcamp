import commonMiddleware from '../libs/middleware.mjs';

const publicEndpoint = () => ({
  statusCode: 200,
  body: JSON.stringify({
    message: 'Public Endpoint',
  }),
});

export default commonMiddleware(publicEndpoint);
