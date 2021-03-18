import './App.global.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Ticker from './components/Ticker';
import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query';

function unique<T>(arr: T[]): T[] {
  return [...new Set([...arr])];
}

const Main = () => {
  const [tickers, setTickers] = useState<string[]>([]);
  const queryClient = useQueryClient();

  function getTickerInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const ticker = (formData.get('ticker') as string).toUpperCase();

    setTickers((tickers) => unique([...tickers, ticker]));

    e.currentTarget.reset();
  }

  function refresh() {
    queryClient.invalidateQueries();
  }

  return (
    <div className="p-4">
      <div className="flex items-center ">
        <div className="flex-1 mr-8">
          <form onSubmit={getTickerInfo}>
            <label className="block text-sm font-medium text-gray-900">
              Enter Ticker Symbol
              <div className="mt-1">
                <input
                  type="text"
                  name="ticker"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-8 block w-full sm:text-sm border-gray-300 rounded-md pl-4"
                  placeholder="NFLX, AAPL, SQ"
                />
              </div>
            </label>
          </form>
        </div>

        <button onClick={refresh}>
          <svg
            className="h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4 mt-6">
        {tickers.map((ticker) => {
          return <Ticker key={ticker} ticker={ticker} />;
        })}
      </div>
    </div>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/" component={Main} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}
