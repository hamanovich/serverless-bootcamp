import AWS from 'aws-sdk';
import { Auction } from '../types/auctionTypes';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const getEndedAuctions = async () => {
  const now = new Date();
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    IndexName: 'statusAndEndingAt',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  const { Items } = await dynamoDB.query(params).promise();

  return Items as Auction[];
};
