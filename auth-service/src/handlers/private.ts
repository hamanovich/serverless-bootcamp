import type { Handler } from 'aws-lambda';

const privateEndpoint: Handler = async (event, context) => ({
  statusCode: 200,
  body: JSON.stringify({
    event,
    context,
  }),
});

export default privateEndpoint;
