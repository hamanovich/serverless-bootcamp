import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import validator from '@middy/validator';
import createAuctionSchema from '../schemas/createAuctionSchema.mjs';
import logger from '../libs/logger.mjs';
import commonMiddleware from '../libs/middleware.mjs';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event) => {
  const { title, duration = 1 } = event.body;
  const email = event.requestContext.authorizer['https://auction/email'];
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + duration);

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email,
  };

  try {
    await dynamoDB
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    logger.error(error, 'Auction creation failed');
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export default commonMiddleware(createAuction).use(validator({ eventSchema: createAuctionSchema }));
