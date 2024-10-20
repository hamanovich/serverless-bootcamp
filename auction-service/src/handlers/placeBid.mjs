import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import validator from '@middy/validator';
import PlaceBidSchema from '../schemas/placeBidSchema.mjs';
import logger from '../libs/logger.mjs';
import commonMiddleware from '../libs/middleware.mjs';
import { getAuctionById } from '../utils/getAuctionById.mjs';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event) => {
  const { id = '' } = event.pathParameters;
  const { amount } = event.body;
  const email = event.requestContext.authorizer['https://auction/email'];
  const {
    seller,
    status,
    highestBid: { bidder, amount: currentAmount },
  } = await getAuctionById(id);

  if (email === seller) throw new createHttpError.Forbidden(`You can't bid on your own auctions!`);
  if (email === bidder) throw new createHttpError.Forbidden(`You are already the highest bidder!`);
  if (status !== 'OPEN') throw new createHttpError.Forbidden("You can't bid on close auctions");
  if (amount <= currentAmount) throw new createHttpError.Forbidden(`Your bid must be higher than ${highestBid.amount}`);

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributeValues: {
      ':amount': amount,
      ':bidder': email,
    },
    ReturnValues: 'ALL_NEW',
  };
  let updatedAuction;

  try {
    const { Attributes: auction } = await dynamoDB.update(params).promise();
    updatedAuction = auction;
  } catch (error) {
    logger.error(error, 'Place bid failed');
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export default commonMiddleware(placeBid).use(validator({ eventSchema: PlaceBidSchema }));
