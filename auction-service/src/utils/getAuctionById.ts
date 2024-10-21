import createHttpError from 'http-errors';
import AWS from 'aws-sdk';
import type { Auction } from '../types/auctionTypes';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id: string) {
  let auction: Auction;

  try {
    const { Item } = await dynamoDB
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME!,
        Key: { id },
      })
      .promise();

    auction = Item as Auction;
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }

  if (!auction) throw new createHttpError.NotFound(`Auction with ID "${id}" not found!`);

  return auction;
}
