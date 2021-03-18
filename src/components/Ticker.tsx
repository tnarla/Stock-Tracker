import axios from 'axios';
import sub from 'date-fns/sub';
import React from 'react';
import { useQuery } from 'react-query';

interface TickerProps {
  ticker: string;
}

enum Change {
  FLAT,
  NEGATIVE,
  POSITIVE,
}

const Ticker = ({ ticker }: TickerProps) => {
  const { data, isLoading } = useQuery(`ticker:${ticker}`, async () => {
    const res = await axios.get<{ open: number; close: number }>(
      `https://api.polygon.io/v1/open-close/${ticker}/${
        sub(new Date(), { days: 1 }).toISOString().split('T')[0]
      }?apiKey=2pc3RfQtzBfB89Mo3zMR95zKdhdAX07G`
    );

    return res.data;
  });

  console.log({ data, isLoading });
  const percentChange = data ? ((data.close - data.open) / data.open) * 100 : 0;
  const changeDirection =
    percentChange > 0
      ? Change.POSITIVE
      : percentChange < 1
      ? Change.NEGATIVE
      : Change.FLAT;

  return (
    <div className="p-4 rounded w-full h-16 bg-white flex">
      <div className="font-bold flex-1">{ticker}</div>
      <div className="flex items-center">
        <p className="text-2xl font-semibold text-gray-900">{data?.close}</p>
        {changeDirection === Change.POSITIVE ? (
          <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
            <svg
              className="self-center flex-shrink-0 h-5 w-5 text-green-500"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Increased by</span>
            {percentChange.toFixed(2)}%
          </p>
        ) : changeDirection === Change.NEGATIVE ? (
          <p className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
            <svg
              className="self-center flex-shrink-0 h-5 w-5 text-red-500"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Decreased by</span>
            {percentChange.toFixed(2)}%
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Ticker;
