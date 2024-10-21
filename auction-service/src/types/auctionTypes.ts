export type Auction = {
  id: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  endingAt: string;
  pictureUrl?: string;
  highestBid: {
    bidder?: string;
    amount: number;
  };
  seller: string;
};
