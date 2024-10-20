import commonMiddleware from '../libs/middleware.mjs';

const privateEndpoint = async (event, context) => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify({
    event,
    context,
  }),
});

export default commonMiddleware(privateEndpoint);
