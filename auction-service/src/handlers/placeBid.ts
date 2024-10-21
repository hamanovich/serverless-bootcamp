import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import validator from '@middy/validator';
import PlaceBidSchema from '../schemas/placeBidSchema';
import logger from '../libs/logger';
import commonMiddleware from '../libs/middleware';
import { getAuctionById } from '../utils/getAuctionById';
import type { Handler } from 'aws-lambda';
import type { Auction } from '../types/auctionTypes';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const placeBid: Handler = async (event) => {
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
  if (amount <= currentAmount) throw new createHttpError.Forbidden(`Your bid must be higher than ${currentAmount}`);

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributeValues: {
      ':amount': amount,
      ':bidder': email,
    },
    ReturnValues: 'ALL_NEW',
  };
  let updatedAuction: Auction;

  try {
    const { Attributes: auction } = await dynamoDB.update(params).promise();
    updatedAuction = auction as Auction;
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
