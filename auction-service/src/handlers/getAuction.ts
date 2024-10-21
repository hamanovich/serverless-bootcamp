import type { Handler } from 'aws-lambda';
import commonMiddleware from '../libs/middleware';
import { getAuctionById } from '../utils/getAuctionById';

const getAuction: Handler = async (event) => {
  const { id = '' } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

export default commonMiddleware(getAuction);
