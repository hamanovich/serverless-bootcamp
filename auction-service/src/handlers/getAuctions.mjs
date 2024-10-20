import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import validator from '@middy/validator';
import getAuctionsSchema from '../schemas/getAuctionsSchema.mjs';
import logger from '../libs/logger.mjs';
import commonMiddleware from '../libs/middleware.mjs';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event) => {
  const { status } = event.queryStringParameters;
  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndingAt',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  try {
    const { Items } = await dynamoDB.query(params).promise();

    auctions = Items;
  } catch (error) {
    logger.error(error, 'Auctions retrieval failed');
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

export default commonMiddleware(getAuctions).use(validator({ eventSchema: getAuctionsSchema }));
