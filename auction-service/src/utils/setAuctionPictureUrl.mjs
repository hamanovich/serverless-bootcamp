import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const setAuctionPictureUrl = async (id, pictureUrl) => {
  const { Attributes } = await dynamoDB
    .update({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set pictureUrl = :pictureUrl',
      ExpressionAttributeValues: {
        ':pictureUrl': pictureUrl,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise();

  return Attributes;
};
