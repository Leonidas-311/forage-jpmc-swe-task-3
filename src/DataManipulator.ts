import { timeStamp } from 'console';
import { ServerRespond } from './DataStreamer';

export interface Row { //Responsible for processing stock data from the server
  price_abc: number,
      price_def: number,
      ratio: number, // ratio of the 2 stocks
      timestamp: Date,
      upper_bound: number,
      lower_bound: number,
      trigger_alert: number | undefined,
}


export class DataManipulator 
{
  // Generates a single row object
    static generateRow(serverRespond: ServerRespond[]): Row { //servreRespond [0] is 1st stock, [1] is 2nd
      const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
      const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
      const ratio = priceABC/priceDEF;
      const upperBound = 1 + 0.5;
      const lowerBound = 1 - 0.5;
      return {
          price_abc: priceABC,
          price_def: priceDEF,
          ratio,
          timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? serverRespond[0].timestamp : serverRespond[1].timestamp,
          upper_bound: upperBound,
          lower_bound: lowerBound,
          trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
      };
    }  
}
