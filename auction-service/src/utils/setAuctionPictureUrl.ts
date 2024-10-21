import AWS from 'aws-sdk';
import { Auction } from '../types/auctionTypes';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const setAuctionPictureUrl = async (id: string, pictureUrl: string) => {
  const { Attributes } = await dynamoDB
    .update({
      TableName: process.env.AUCTIONS_TABLE_NAME!,
      Key: { id },
      UpdateExpression: 'set pictureUrl = :pictureUrl',
      ExpressionAttributeValues: {
        ':pictureUrl': pictureUrl,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise();

  return Attributes as Auction;
};
