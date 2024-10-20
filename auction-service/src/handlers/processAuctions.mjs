import createHttpError from 'http-errors';
import { getEndedAuctions } from '../utils/getEndedAuctions.mjs';
import { closeAuction } from '../utils/closeAuction.mjs';
import logger from '../libs/logger.mjs';

const processAuctions = async () => {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map((auction) => closeAuction(auction));

    await Promise.all(closePromises);

    return { closed: closePromises.length };
  } catch (error) {
    logger.error(error, 'Auction processing failed');
    throw new createHttpError.InternalServerError(error);
  }
};

export default processAuctions;
